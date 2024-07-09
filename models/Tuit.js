const mongoose = require("mongoose");

const tuitSchema = new mongoose.Schema({
  tuit: { type: String, required: true },
  time: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  imageUrl: { type: String }, // Add imageUrl field
});

const Tuit = mongoose.model("Tuit", tuitSchema);
module.exports = Tuit;
