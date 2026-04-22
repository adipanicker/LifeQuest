const pool = require("../db");

const getGoals = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT g.*,
            COUNT(t.id) FILTER (WHERE t.goal_id = g.id) AS total_todos,
            COUNT(t.id) FILTER (WHERE t.goal_id = g.id AND t.is_completed = true) AS completed_todos
            FROM goals g
            LEFT JOIN todos t ON t.goal_id = g.id
            WHERE g.user_id = $1
            GROUP BY g.id
            ORDER BY g.created_at DESC`,
      [req.userId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const createGoal = async (req, res) => {
  const { title, deadline } = req.body;

  try {
    const goalCount = await pool.query(
      "SELECT COUNT(*) FROM goals WHERE user_id = $1 AND is_completed = false",
      [req.userId],
    );
    if (parseInt(goalCount.rows[0].count) >= 3) {
      return res
        .status(400)
        .json({ message: "Maximum 3 active goals allowed" });
    }

    const result = await pool.query(
      `INSERT INTO goals (user_id, title, deadline)
            VALUES ($1, $2, $3) RETURNING *`,
      [req.userId, title, deadline || null],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const completeGoal = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE goals SET is_completed = true
            WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, req.userId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Goal not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteGoal = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM goals WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.userId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Goal not found" });
    }
    res.json({ message: "Goal deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getGoals, createGoal, completeGoal, deleteGoal };
