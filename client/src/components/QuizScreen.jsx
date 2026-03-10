import { useState } from "react";
import Timer from "./Timer";

const OPTION_KEYS = ["A", "B", "C", "D"];
const QUIZ_DURATION = 5 * 60; // 5 minutes in seconds

const QuizScreen = ({ quiz, onFinish }) => {
  const { questions, name, topic, difficulty } = quiz;

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedIndex | null }
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION);

  const q = questions[current];
  const userAnswer = answers[q.id];
  const isAnswered = userAnswer !== undefined;
  const progressPercent = (current / questions.length) * 100;

  // Handlers
  const handleSelect = (optionIndex) => {
    if (isAnswered) return;
    setAnswers((prev) => ({ ...prev, [q.id]: optionIndex }));
    setRevealed(true);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setRevealed(false);
    } else {
      submitQuiz(false);
    }
  };

  const handleSkip = () => {
    setAnswers((prev) => ({ ...prev, [q.id]: null }));
    setRevealed(false);
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      submitQuiz(false);
    }
  };

  const submitQuiz = (autoSubmit = false) => {
    const timeSpent = QUIZ_DURATION - timeLeft;
    onFinish({ answers, questions, name, topic, difficulty, timeSpent, autoSubmit });
  };

  // Option styling
  const getOptionClass = (idx) => {
    if (!isAnswered) return "option-btn";
    if (idx === q.correct) return "option-btn correct";
    if (idx === userAnswer && idx !== q.correct) return "option-btn wrong";
    return "option-btn";
  };

  const isLastQuestion = current === questions.length - 1;

  return (
    <div className="card quiz-card">
      {/* Meta Row */}
      <div className="quiz-meta">
        <div className="progress-info">
          Question <span className="accent">{current + 1}</span> of{" "}
          <span className="accent">{questions.length}</span>
          &nbsp;·&nbsp;{difficulty}&nbsp;·&nbsp;{topic}
        </div>
        <Timer
          timeLeft={timeLeft}
          onTick={(t) => setTimeLeft(t)}
          onExpire={() => submitQuiz(true)}
        />
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question */}
      <div className="question-num">Question {current + 1}</div>
      <div className="question-text">{q.question}</div>

      {/* Options */}
      <div className="options-grid">
        {q.options.map((opt, idx) => (
          <button
            key={idx}
            className={getOptionClass(idx)}
            onClick={() => handleSelect(idx)}
            disabled={isAnswered}
          >
            <span className="option-key">{OPTION_KEYS[idx]}</span>
            {opt}
          </button>
        ))}
      </div>

      {/* Explanation Feedback */}
      <div className={`feedback-box ${revealed && isAnswered ? "show" : ""}`}>
        {revealed && isAnswered
          ? userAnswer === q.correct
            ? `✅ Correct! ${q.explanation}`
            : `❌ Incorrect. ${q.explanation}`
          : "Select an answer to see the explanation."}
      </div>

      {/* Navigation */}
      <div className="nav-row">
        <div className="nav-left">
          {!isAnswered ? (
            <button className="btn-secondary" onClick={handleSkip}>
              Skip →
            </button>
          ) : (
            <span className="answer-status">
              {userAnswer === q.correct ? "✅ Correct" : "❌ Wrong"}
            </span>
          )}
        </div>
        <div className="nav-right">
          {isLastQuestion ? (
            <button
              className="btn-submit"
              onClick={() => submitQuiz(false)}
              disabled={!isAnswered}
            >
              Finish Quiz 🏁
            </button>
          ) : (
            <button
              className="btn-submit"
              onClick={handleNext}
              disabled={!isAnswered}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;