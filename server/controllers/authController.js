const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");
const crypto = require("crypto");
const resend = new Resend(process.env.RESEND_API_KEY);

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, name, email, xp, level, streak`,
      [name, email, hashedPassword],
    );

    const user = result.rows[0];

    //Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

//TODO: add streak update logic in login later
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //Find user
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    //check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        onboarding_completed: user.Onboarding_complete,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getMe = async (req, res) => {
  try {
    console.log("getMe called, userId:", req.userId); // add this
    const result = await pool.query(
      "SELECT id, name, email, xp, level, streak, onboarding_complete FROM users WHERE id = $1",
      [req.userId],
    );
    console.log("query result:", result.rows); // add this
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length == 0) {
      return res.json({
        message: "If that email exists, a rest link has been sent.",
      });
    }

    const user = result.rows[0];
    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 1000 * 60 * 30; //30 minutes

    await pool.query(
      "UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3",
      [token, expires, user.id],
    );

    console.log("Token saved to DB:", token);

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    const sendResult = await resend.emails.send({
      from: "LifeQuest <noreply@adityapanicker.com>",
      to: email,
      subject: "Reset your LifeQuest password",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
          <h2>Reset your password</h2>
          <p>You requested a password reset for your LifeQuest account.</p>
          <a href="${resetLink}" style="display:inline-block; padding: 12px 24px; background:#6366f1; color:white; border-radius:8px; text-decoration:none; font-weight:bold;">
            Reset Password
          </a>
          <p style="margin-top:16px; color:#888; font-size:13px;">This link expires in 30 minutes. If you didn't request this, ignore this email.</p>
        </div>
      `,
    });
    console.log("Resend result:", JSON.stringify(sendResult));
    res.json({ message: "If that email exists, a reset link has been sent" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  console.log("Reset token received:", token);

  try {
    const result = await pool.query(
      "SELECT id, reset_token_expires FROM users WHERE reset_token = $1",
      [token],
    );

    if (result.rows.length == 0) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    const user = result.rows[0];

    if (Date.now() > user.reset_token_expires) {
      return res
        .status(400)
        .json({ message: "Reset link has expired. Please request a new one." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2",
      [hashedPassword, user.id],
    );

    res.json({ message: "Password reset successful. You can now log in." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const completeOnboarding = async (req, res) => {
  try {
    await pool.query(
      "UPDATE users SET onboarding_complete = TRUE where id = $1",
      [req.userId],
    );
    res.json({ message: "Onboarding complete" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  completeOnboarding,
};
