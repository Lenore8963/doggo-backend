const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure you have OPENAI_API_KEY in your .env file
});

// Define routes
const userRoutes = require("./routes/user");
const tuitRoutes = require("./routes/tuits");
app.use("/api/users", userRoutes);
app.use("/api/tuits", tuitRoutes);

// OpenAI route
app.post("/api/ask", async (req, res) => {
  const { question } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: question }],
      max_tokens: 150,
    });

    res.json({ answer: response.choices[0].message.content });
  } catch (error) {
    console.error("Error asking OpenAI:", error);
    res.status(500).send("Something went wrong");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
