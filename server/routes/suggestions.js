const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  getSuggestions,
  acceptSuggestion,
  triggerSuggestions,
  dismissSuggestion,
} = require("../controllers/suggestionsController");

router.get("/", authMiddleware, getSuggestions);
router.post("/trigger", authMiddleware, triggerSuggestions);
router.post("/:id/accept", authMiddleware, acceptSuggestion);
router.delete("/:id", authMiddleware, dismissSuggestion);

module.exports = router;
