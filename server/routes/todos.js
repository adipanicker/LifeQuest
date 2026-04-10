const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  getTodos,
  createTodo,
  completeTodo,
  deleteTodo,
} = require("../controllers/todosController");

//All routes are protected
router.get("/", authMiddleware, getTodos);
router.post("/", authMiddleware, createTodo);
router.patch("/:id/complete", authMiddleware, completeTodo);
router.delete("/:id", authMiddleware, deleteTodo);

module.exports = router;
