const pool = require("../db");
const { generateSuggestionsForUser } = require("../services/aiSuggestions");

//GET today's suggestions for logged in user
const getSuggestions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, g.title as goal_title
            FROM ai_suggestions s
            LEFT JOIN goals g ON s.goal_id = g.id
            WHERE s.user_id = $1 AND s.suggested_date = CURRENT_DATE
            ORDER BY s.created_at ASC`,
      [req.userId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// POST add suggestion to today's quests
const acceptSuggestion = async (req, res) => {
  const { id } = req.params;
  try {
    //Get the suggestion
    const suggestion = await pool.query(
      "SELECT * FROM ai_suggestions WHERE id = $1 AND user_id = $2",
      [id, req.userId],
    );

    if (suggestion.rows.length === 0) {
      return res.status(404).json({ message: "Suggestion not found" });
    }

    const s = suggestion.rows[0];

    //Create a todo from this suggestion
    const todo = await pool.query(
      `INSERT INTO todos (user_id, title, xp_reward, goal_id, is_ai_suggested)
            VALUES ($1, $2, $3, $4, true) RETURNING *`,
      [req.userId, s.title, s.xp_reward, s.goal_id],
    );

    // Mark suggestion as added
    await pool.query(
      "UPDATE ai_suggestions SET is_added = true WHERE id = $1",
      [id],
    );

    res.status(201).json(todo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

//POST manually trigger suggestions (for testing)
const triggerSuggestions = async (req, res) => {
  try {
    // Get current count and reset date
    const userResult = await pool.query(
      "SELECT daily_suggestion_count, suggestion_reset_date FROM users WHERE id = $1",
      [req.userId],
    );

    const user = userResult.rows[0];
    const today = new Date().toISOString().split("T")[0];
    const resetDate = user.suggestion_reset_date?.toISOString?.().split("T")[0];

    // Reset count if it's a new day
    if (resetDate !== today) {
      await pool.query(
        "UPDATE users SET daily_suggestion_count = 0, suggestion_reset_date = CURRENT_DATE WHERE id = $1",
        [req.userId],
      );
      user.daily_suggestion_count = 0;
    }

    // Check limit
    if (user.daily_suggestion_count >= 2) {
      return res
        .status(429)
        .json({ message: "Max 2 AI generations per day. Come back tomorrow!" });
    }

    // Generate
    await generateSuggestionsForUser(req.userId);

    // Increment count
    await pool.query(
      "UPDATE users SET daily_suggestion_count = daily_suggestion_count + 1 WHERE id = $1",
      [req.userId],
    );

    res.json({ message: "Suggestions generated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};
//DELETE dismiss a suggestion
const dismissSuggestion = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      "DELETE FROM ai_suggestions WHERE id = $1 AND user_id = $2",
      [id, req.userId],
    );
    res.json({ message: "Suggestion dismissed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getSuggestions,
  acceptSuggestion,
  triggerSuggestions,
  dismissSuggestion,
};
