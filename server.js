// ---------- IMPORTS ----------
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const User = require("./models/User");

// Load variables from config/.env (locally). On Azure they come from the Web App settings.
dotenv.config({ path: "./config/.env" });

const app = express();
app.use(express.json()); // read JSON request bodies

// ---------- DATABASE ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Database connection error:", err.message));

// ---------- API ROUTES ----------

// GET: return all users
app.get("/api/users", async (req, res) => {
  try {
    res.status(200).json(await User.find());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: add a new user
app.post("/api/users", async (req, res) => {
  try {
    const savedUser = await new User(req.body).save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT: edit a user by id
app.put("/api/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,           // return the updated user
      runValidators: true, // apply schema rules
    });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: remove a user by id
app.delete("/api/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ---------- SERVE THE REACT BUILD ----------
// Static files (JS, CSS, index.html) built by React live in the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Any other URL returns React's index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ---------- START ----------
// Azure provides PORT automatically; locally we use 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
