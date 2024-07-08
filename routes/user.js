// routes/user.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Follow a user
router.post("/follow", async (req, res) => {
  try {
    const { userId, followUserId } = req.body;
    const user = await User.findById(userId);
    if (!user.followedUsers.includes(followUserId)) {
      user.followedUsers.push(followUserId);
      await user.save();
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: "User already followed" });
    }
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ error: "Failed to follow user" });
  }
});

// Unfollow a user
router.post("/unfollow", async (req, res) => {
  try {
    const { userId, unfollowUserId } = req.body;
    const user = await User.findById(userId);
    user.followedUsers = user.followedUsers.filter(
      (id) => id.toString() !== unfollowUserId
    );
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({ error: "Failed to unfollow user" });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { username, password, firstName, lastName } = req.body;
    if (!username || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newUser = new User({ username, password, firstName, lastName });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
});

module.exports = router;
