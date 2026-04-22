const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  getGoals,
  createGoal,
  completeGoal,
  deleteGoal,
} = require("../controllers/goalsController");

router.get("/", authMiddleware, getGoals);
router.post("/", authMiddleware, createGoal);
router.patch("/:id/complete", authMiddleware, completeGoal);
router.delete("/:id", authMiddleware, deleteGoal);

module.exports = router;
