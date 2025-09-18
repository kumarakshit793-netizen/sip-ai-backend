import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// AI Chat endpoint
app.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question) return res.status(400).json({ error: "No question provided" });

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "OpenAI API key not set in environment variables." });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (data.choices && data.choices[0] && data.choices[0].message) {
      res.json({ answer: data.choices[0].message.content });
    } else {
      res.json({ answer: "AI could not generate a response." });
    }
  } catch (err) {
    console.error("Error contacting OpenAI:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// Optional: Root endpoint
app.get("/", (req, res) => {
  res.send("Backend is running. Use POST /ask to talk to AI.");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

