const { GoogleGenerativeAI } = require("@google/generative-ai");
const pool = require("../db");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const generateSuggestionsForUser = async (userId) => {
  try {
    //Get user's active goals
    const goalsResult = await pool.query(
      `SELECT id, title, description, deadline FROM goals
            WHERE user_id = $1 AND is_completed = false`,
      [userId],
    );

    console.log("Goals found:", goalsResult.rows);

    const goals = goalsResult.rows;
    if (goals.length === 0) {
      console.log("No goals found for user", userId);
      return;
    }

    //Get last 7 days of completed todos
    const historyResult = await pool.query(
      `SELECT title, completed_at
            FROM todos
            WHERE user_id = $1
            AND is_completed = true
            AND completed_at >= NOW() - INTERVAL '7 days'
            ORDER BY completed_at DESC`,
      [userId],
    );

    const recentTodos = historyResult.rows.map((t) => t.title);

    //Build prompt
    const goalsText = goals
      .map((g) => {
        let text = `- Goal: "${g.title}"`;
        if (g.description) text += `\n Details: ${g.description}`;
        if (g.deadline) text += `\n Deadline: ${g.deadline}`;
        return text;
      })
      .join("\n");

    const historyText =
      recentTodos.length > 0
        ? recentTodos.slice(0, 10).join(", ")
        : "No recent tasks";

    const prompt = `You are a productivity coach. A user has the following active goals: 
        ${goalsText}
        Their recently completed tasks (last 7 days):
        ${historyText}
        
        Generate exactly 3 specific, actionable tasks for TODAY that will help them make progress on their goals.
        
        Rules:
        - Each task must be completable in one day
        - Be specific, not vague (e.g. "Solve 2 sliding window problems on LeetCode" not "Study DSA")
        - Vary the tasks across different goals if the user has multiple goals
        - Consider their recent history to avoid repetition
        - Keep each task under 60 characters
        
        Respond with ONLY a JSON array of 3 strings. No explanation, no markdown, just the array.
        Example: ["Task one here", "Task two here", "Task three here"]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    console.log("Gemini raw response:", text);

    //Parse response
    const clean = text.replace(/```json|```/g, "").trim();
    const suggestions = JSON.parse(clean);
    console.log("Parsed suggestions:", suggestions);

    if (!Array.isArray(suggestions) || suggestions.length === 0) return;

    //Delete today's existing suggestions for this user
    await pool.query(
      `DELETE FROM ai_suggestions
            WHERE user_id = $1 AND suggested_date = CURRENT_DATE`,
      [userId],
    );

    //Insert new suggestions
    for (const title of suggestions.slice(0, 3)) {
      //Find the most relevant goal for this suggestion
      const goalId = goals[0].id; //default to first goal

      await pool.query(
        `INSERT INTO ai_suggestions (user_id, goal_id, title, xp_reward, suggested_date)
                VALUES ($1, $2, $3, 25, CURRENT_DATE)`,
        [userId, goalId, title],
      );
    }
    console.log(
      `Generated ${suggestions.length} suggestions for user ${userId}`,
    );
  } catch (err) {
    console.error(`AI suggestion error for user ${userId}:`, err.message);
  }
};

const generateSuggestionsForAllUsers = async () => {
  try {
    // Get all users who have at least one active goal
    const userResult = await pool.query(
      `SELECT DISTINCT user_id FROM goals WHERE is_completed = false`,
    );

    console.log(
      `Generating suggestions for ${userResult.rows.length} users...`,
    );

    for (const row of userResult.rows) {
      await generateSuggestionsForUser(row.userId);
    }

    console.log("AI suggestions generation complete ✅");
  } catch (err) {
    console.error("Error generating suggestions:", err.message);
  }
};

module.exports = { generateSuggestionsForUser, generateSuggestionsForAllUsers };
