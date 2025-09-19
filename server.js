// server.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// --- Root Route (check if backend is alive) ---
app.get("/", (req, res) => {
  res.send("✅ SIP Backend is running...");
});

// --- SIP Calculator (SIP + Step-up) ---
app.post("/sip", (req, res) => {
  const { monthlyInvestment, annualRate, years, stepUpPercent } = req.body;

  let totalInvested = 0;
  let futureValue = 0;
  const months = years * 12;
  let currentInvestment = monthlyInvestment;

  for (let i = 1; i <= months; i++) {
    futureValue =
      (futureValue + currentInvestment) * (1 + annualRate / 100 / 12);
    totalInvested += currentInvestment;

    // every 12 months increase SIP by step-up
    if (stepUpPercent && i % 12 === 0) {
      currentInvestment += (monthlyInvestment * stepUpPercent) / 100;
    }
  }

  res.json({
    totalInvested: totalInvested.toFixed(2),
    futureValue: futureValue.toFixed(2),
    gain: (futureValue - totalInvested).toFixed(2),
  });
});

// --- Lumpsum Calculator ---
app.post("/lumpsum", (req, res) => {
  const { principal, annualRate, years } = req.body;

  const futureValue = principal * Math.pow(1 + annualRate / 100, years);

  res.json({
    invested: principal.toFixed(2),
    futureValue: futureValue.toFixed(2),
    gain: (futureValue - principal).toFixed(2),
  });
});

// --- AI Chat Assistant ---
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a SIP and investment assistant. Explain SIP, Lumpsum, step-up features in simple words.",
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    res.json({
      reply: data.choices?.[0]?.message?.content || "No reply from AI.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI service failed." });
  }
});

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
