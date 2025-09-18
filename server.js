import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ask", async (req, res) => {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "No question provided" });

    try {
        const apiKey = process.env.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`,;
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer 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`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: question }],
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0] && data.choices[0].message) {
            res.json({ answer: data.choices[0].message.content });
        } else {
            res.json({ answer: "AI could not generate a response." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error: " + err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
