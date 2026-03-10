import { useState } from "react";
import StartScreen from "./components/StartScreen";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";
import "./App.css";

// Screens: "start" | "quiz" | "result"
const App = () => {
  const [screen, setScreen] = useState("start");
  const [quizData, setQuizData] = useState(null);
  const [resultData, setResultData] = useState(null);

  const handleStart = (data) => {
    setQuizData(data);
    setScreen("quiz");
  };

  const handleFinish = (result) => {
    setResultData(result);
    setScreen("result");
  };

  const handleRetry = () => {
    setQuizData(null);
    setResultData(null);
    setScreen("start");
  };

  return (
    <div className="quiz-app">
      {/* Header */}
      <div className="header">
        <div className="header-badge">
          <span>◆</span> AI-Powered
        </div>
        <h1>Quiz<br />Generator</h1>
        <p>Powered by Groq · Adaptive difficulty · Real-time evaluation</p>
      </div>

      {/* Screens */}
      {screen === "start" && <StartScreen onStart={handleStart} />}
      {screen === "quiz" && quizData && (
        <QuizScreen quiz={quizData} onFinish={handleFinish} />
      )}
      {screen === "result" && resultData && (
        <ResultScreen result={resultData} onRetry={handleRetry} />
      )}
    </div>
  );
};

export default App;