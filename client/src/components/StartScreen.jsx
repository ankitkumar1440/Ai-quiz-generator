import { useState } from "react";
import { generateQuiz } from "../services/api";

const SUGGESTED_TOPICS = [
  "Mathematics", "Science", "History", "Geography",
  "Literature", "Technology", "Sports", "Music",
  "Movies", "General Knowledge",
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const StartScreen = ({ onStart }) => {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    if (!topic.trim()) {
      setError("Please enter or select a topic.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await generateQuiz(topic.trim(), difficulty, name.trim());
      onStart({ name: name.trim(), topic: topic.trim(), difficulty, questions: data.questions });
    } catch (err) {
      setError("Failed to generate quiz. Please check your connection and try again.");
      console.error(err);
    }
    setLoading(false);
  };

  const getDiffClass = (d) => {
    if (difficulty !== d) return "diff-btn";
    return `diff-btn active-${d.toLowerCase()}`;
  };

  return (
    <div className="start-screen">
      {error && <div className="error-box">⚠️ {error}</div>}

      <div className="card setup-card">
        {/* Name */}
        <div className="field">
          <label htmlFor="name">Your Name (optional)</label>
          <input
            id="name"
            type="text"
            placeholder="e.g. Alex"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Topic */}
        <div className="field">
          <label htmlFor="topic">Quiz Topic</label>
          <input
            id="topic"
            type="text"
            list="topic-suggestions"
            placeholder="Type any topic or pick one below..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <datalist id="topic-suggestions">
            {SUGGESTED_TOPICS.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
          <div className="topic-chips">
            {SUGGESTED_TOPICS.slice(0, 6).map((t) => (
              <button
                key={t}
                className={`chip ${topic === t ? "chip-active" : ""}`}
                onClick={() => setTopic(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="field">
          <label>Difficulty Level</label>
          <div className="difficulty-grid">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                className={getDiffClass(d)}
                onClick={() => setDifficulty(d)}
              >
                {d === "Easy" ? "🟢" : d === "Medium" ? "🟡" : "🔴"} {d}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          className="btn-primary"
          onClick={handleStart}
          disabled={loading || !topic.trim()}
        >
          {loading ? "✨ Generating Quiz..." : "Generate Quiz →"}
        </button>
      </div>

      {loading && (
        <div className="loading-wrap">
          <div className="spinner" />
          <p>AI is crafting your {difficulty.toLowerCase()} quiz on &quot;{topic}&quot;...</p>
        </div>
      )}
    </div>
  );
};

export default StartScreen;