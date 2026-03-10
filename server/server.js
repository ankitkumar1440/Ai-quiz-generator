const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
  res.json({ message: "AI Quiz Generator API is running with Groq!" });
});

// Generate Quiz Questions
app.post("/api/generate-quiz", async (req, res) => {
  const { topic, difficulty, name, numQuestions = 5 } = req.body;

  if (!topic || !difficulty) {
    return res.status(400).json({ error: "Topic and difficulty are required." });
  }

  const prompt = `Generate a quiz for a user named ${name || "the user"}.
Topic: "${topic}"
Difficulty: ${difficulty}
Number of questions: ${numQuestions}

Return ONLY valid JSON in this exact format (no markdown, no extra text, no code blocks):
{
  "questions": [
    {
      "id": 1,
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Brief explanation of the correct answer."
    }
  ]
}

Rules:
- "correct" is the 0-based index of the correct option in the options array.
- Questions must match the ${difficulty} difficulty level.
- All 4 options must be plausible distractors.
- Explanations should be 1-2 sentences.
- Return pure JSON only, absolutely no markdown formatting or code fences.`;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a quiz generator. Always respond with pure valid JSON only. Never use markdown, never use code fences."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    const text = response.data.choices[0].message.content;

    const clean = text.replace(/```json|```/g, "").trim();

    const quizData = JSON.parse(clean);

    res.json({ success: true, data: quizData });

  } catch (error) {
    console.error("Groq API Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to generate quiz. Please try again.",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🤖 Using Groq API (llama-3.3-70b) — Free & Fast!`);
});