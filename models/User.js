const mongoose = require("mongoose");

const dogSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  followedUsers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  dogs: [dogSchema],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
