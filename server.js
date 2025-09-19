// server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Get from Render environment
});

// Test route
app.get("/", (req, res) => {
  res.send("✅ SIP AI Backend is running!");
});

// Chat route
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "⚠️ No message provided." });
    }

    // Ask OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const aiReply = completion.choices[0].message.content;
    res.json({ reply: aiReply });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ reply: "❌ AI not responding. Please try again." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
