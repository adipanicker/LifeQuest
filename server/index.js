const express = require("express");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const pool = require("./db");
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todos");

const app = express();
const corsOptions = {
  origin: ["http://localhost:5173", "https://life-quest-chi.vercel.app"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

app.get("/", (req, res) => {
  res.json({ message: "LifeQuest API is live" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//Test DB
pool
  .query("SELECT NOW()")
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error("DB connection failed:", err.message));
