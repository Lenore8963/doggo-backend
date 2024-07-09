const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const Tuit = require("../models/Tuit");

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Get all tuits
router.get("/", async (req, res) => {
  try {
    const tuits = await Tuit.find().populate("userId", "firstName lastName");
    res.json(tuits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new tuit with optional image upload
router.post("/", upload.single("image"), async (req, res) => {
  const { tuit, userId } = req.body;
  let imageUrl = null;

  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  }

  if (!tuit || !userId) {
    console.error("Missing tuit or userId");
    return res.status(400).json({ message: "Tuit and userId are required" });
  }

  const newTuit = new Tuit({ tuit, userId, imageUrl });

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
