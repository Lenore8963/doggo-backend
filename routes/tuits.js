const express = require("express");
const router = express.Router();
const Tuit = require("../models/Tuit");

// Get all tuits
router.get("/", async (req, res) => {
  try {
    const tuits = await Tuit.find().populate("userId", "firstName lastName");
    res.json(tuits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new tuit
router.post("/", async (req, res) => {
  const { tuit, userId } = req.body;
  console.log("Received tuit:", tuit);
  console.log("Received userId:", userId);
  if (!tuit || !userId) {
    console.error("Missing tuit or userId");
    return res.status(400).json({ message: "Tuit and userId are required" });
  }

  const newTuit = new Tuit({ tuit, userId });

  try {
    const savedTuit = await newTuit.save();
    const populatedTuit = await Tuit.findById(savedTuit._id).populate(
      "userId",
      "firstName lastName"
    );
    res.status(201).json(populatedTuit);
  } catch (err) {
    console.error("Error saving tuit:", err.message);
    res.status(400).json({ message: err.message });
  }
});

// Delete a tuit
router.delete("/:id", async (req, res) => {
  try {
    const tuit = await Tuit.findByIdAndDelete(req.params.id);
    if (!tuit) return res.status(404).json({ message: "Tuit not found" });

    res.json({ message: "Tuit deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
