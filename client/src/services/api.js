import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Generate quiz questions from the backend
 * @param {string} topic - Quiz topic
 * @param {string} difficulty - Easy | Medium | Hard
 * @param {string} name - User's name (optional)
 * @param {number} numQuestions - Number of questions (default 5)
 * @returns {Promise<{questions: Array}>}
 */
export const generateQuiz = async (topic, difficulty, name = "", numQuestions = 5) => {
  const response = await api.post("/api/generate-quiz", {
    topic,
    difficulty,
    name,
    numQuestions,
  });
  return response.data.data; // { questions: [...] }
};

export default api;