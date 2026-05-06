import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Health check
app.get("/", (req, res) => {
  res.send("Jarvis is running 💫");
});

// Chat route
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are a personal AI assistant created by his girlfriend.

Personality:
- Warm, caring, and emotionally supportive
- Slightly romantic but natural (not too dramatic)
- Talk like a real person, not robotic
- Encourage him, remind him to eat, rest, and stay focused
- Sometimes playful and gentle

Rules:
- Keep responses short and natural
- Occasionally use his name if provided
- Make him feel cared for and not alone
          `,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const reply = response.choices[0].message.content;

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.json({
      reply: "⚠️ Something went wrong. Try again."
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});