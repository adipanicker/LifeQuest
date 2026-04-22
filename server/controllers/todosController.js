const pool = require("../db");

//GET all todos for logged in user
const getTodos = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC",
      [req.userId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const createTodo = async (req, res) => {
  const { title } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO todos (user_id, title)
            VALUES($1, $2)
            RETURNING *`,
      [req.userId, title],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

//PATCH complete a todo + award XP
const completeTodo = async (req, res) => {
  const { id } = req.params;

  try {
    //check todo exists and belongs to this user
    const todo = await pool.query(
      "SELECT * FROM todos WHERE id = $1 AND user_id = $2",
      [id, req.userId],
    );

    if (todo.rows.length === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (todo.rows[0].is_completed) {
      return res.status(400).json({ message: "Todo already completed" });
    }

    // Award XP to user and check for level up
    const isGoalLinked = todo.rows[0].goal_id !== null;
    const xpReward = isGoalLinked ? 20 : todo.rows[0].xp_reward;

    //Mark todo as completed
    await pool.query(
      `UPDATE todos
            SET is_completed = true, completed_at = NOW(), xp_reward = $1
            where id = $2`,
      [xpReward, id],
    );

    const updatedUser = await pool.query(
      `UPDATE users
   SET
     xp = xp + $1,
     level = FLOOR((xp + $1) / 100) + 1,
     last_active = (NOW() AT TIME ZONE 'Asia/Kolkata')::DATE,
     streak = CASE
       WHEN last_active = (NOW() AT TIME ZONE 'Asia/Kolkata')::DATE - INTERVAL '1 day' THEN streak + 1
       WHEN last_active = (NOW() AT TIME ZONE 'Asia/Kolkata')::DATE THEN streak
       ELSE 1
     END
   WHERE id = $2
   RETURNING id, name, xp, level, streak`,
      [xpReward, req.userId],
    );

    res.json({
      message: "Todo completed! XP awarded!",
      xpAwarded: xpReward,
      user: updatedUser.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

//Link todo to Goal
const linkToGoal = async (req, res) => {
  const { id } = req.params;
  const { goal_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE todos
        SET goal_id = $1, xp_reward = CASE WHEN $1::INT IS NOT NULL THEN 20 ELSE 10 END
        WHERE id = $2 AND user_id = $3
        RETURNING *`,
      [goal_id || null, id, req.userId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

//DELETE a todo
const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.userId],
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Todo not found" });
    }

    res.json({ message: "Todo deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

//Resurrect a todo
const resurrectTodo = async (req, res) => {
  const { id } = req.params;
  try {
    const original = await pool.query(
      `SELECT * FROM todos WHERE id = $1 AND user_id = $2`,
      [id, req.userId],
    );
    if (original.rows.length === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    const result = await pool.query(
      `INSERT INTO todos (user_id, title, xp_reward)
      VALUES ($1, $2, $3) RETURNING *`,
      [
        original.rows[0].user_id,
        original.rows[0].title,
        original.rows[0].xp_reward,
      ],
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getTodos,
  createTodo,
  completeTodo,
  linkToGoal,
  deleteTodo,
  resurrectTodo,
};
