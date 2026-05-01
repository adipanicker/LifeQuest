const express = require("express");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();
const cron = require("node-cron");

const pool = require("./db");
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todos");
const goalsRoutes = require("./routes/goals");
const suggestionRoutes = require("./routes/suggestions");

const { generateSuggestionsForAllUsers } = require("./services/aiSuggestions");

const app = express();
const corsOptions = {
  origin: ["http://localhost:5173", "https://life-quest-chi.vercel.app"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/suggestions", suggestionRoutes);

app.get("/", (req, res) => {
  res.json({ message: "LifeQuest API is live" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Runs at 6:00 AM IST every day (IST = UTC+5:30, so 00:30 UTC)
cron.schedule("30 0 * * *", async () => {
  console.log("Running daily AI suggestion generation...");
  await generateSuggestionsForAllUsers();
});

//Test DB
pool
  .query("SELECT NOW()")
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error("DB connection failed:", err.message));
