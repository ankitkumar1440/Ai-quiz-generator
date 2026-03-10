const OPTION_KEYS = ["A", "B", "C", "D"];

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const getEmoji = (pct) => {
  if (pct === 100) return "🏆";
  if (pct >= 80) return "🎉";
  if (pct >= 60) return "👍";
  if (pct >= 40) return "📚";
  return "💪";
};

const getTitle = (pct) => {
  if (pct === 100) return "Perfect Score!";
  if (pct >= 80) return "Excellent Work!";
  if (pct >= 60) return "Good Job!";
  if (pct >= 40) return "Keep Practicing";
  return "Don't Give Up!";
};

const getPerformanceColor = (pct) => {
  if (pct >= 70) return "#10b981";
  if (pct >= 40) return "#f59e0b";
  return "#ef4444";
};

const ResultScreen = ({ result, onRetry }) => {
  const { answers, questions, name, topic, difficulty, timeSpent, autoSubmit } = result;

  const correct = questions.filter((q) => answers[q.id] === q.correct).length;
  const skipped = questions.filter(
    (q) => answers[q.id] === null || answers[q.id] === undefined
  ).length;
  const wrong = questions.length - correct - skipped;
  const pct = Math.round((correct / questions.length) * 100);
  const color = getPerformanceColor(pct);

  // SVG ring calculations
  const RADIUS = 54;
  const circumference = 2 * Math.PI * RADIUS;
  const dashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className="card result-card">
      {/* Auto-submit notice */}
      {autoSubmit && (
        <div className="auto-submit-notice">
          ⏰ Time&apos;s up — quiz was auto-submitted
        </div>
      )}

      {/* Score Ring */}
      <div className="score-ring">
        <svg width="140" height="140" viewBox="0 0 120 120">
          <circle
            cx="60" cy="60" r={RADIUS}
            fill="none"
            stroke="var(--border)"
            strokeWidth="8"
            transform="rotate(-90 60 60)"
          />
          <circle
            cx="60" cy="60" r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="score-ring-text">
          <div className="score-pct">{pct}%</div>
          <div className="score-label">Score</div>
        </div>
      </div>

      {/* Title */}
      <div className="result-title">
        {getEmoji(pct)} {getTitle(pct)}
      </div>
      <div className="result-sub">
        {name ? `${name}, you scored` : "You scored"} {correct}/{questions.length} on{" "}
        {difficulty} {topic} · Time: {formatTime(timeSpent)}
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-box stat-correct">
          <div className="stat-val">{correct}</div>
          <div className="stat-name">Correct</div>
        </div>
        <div className="stat-box stat-wrong">
          <div className="stat-val">{wrong}</div>
          <div className="stat-name">Wrong</div>
        </div>
        <div className="stat-box stat-skipped">
          <div className="stat-val">{skipped}</div>
          <div className="stat-name">Skipped</div>
        </div>
      </div>

      {/* Answer Review */}
      <div className="answers-list">
        <h3>Review Answers</h3>
        {questions.map((q) => {
          const userAns = answers[q.id];
          const isSkip = userAns === null || userAns === undefined;
          const isCorrect = userAns === q.correct;
          return (
            <div
              key={q.id}
              className={`answer-item ${
                isSkip ? "a-skip" : isCorrect ? "a-correct" : "a-wrong"
              }`}
            >
              <div className="answer-q">
                {q.id}. {q.question}
              </div>
              <div className="answer-detail">
                {isSkip ? (
                  <>
                    <span className="skip-c">⏩ Skipped.</span> Correct:{" "}
                    <span className="ok">{q.options[q.correct]}</span>
                  </>
                ) : isCorrect ? (
                  <span className="ok">✅ {q.options[q.correct]}</span>
                ) : (
                  <>
                    <span className="bad">
                      ✗ You chose: {OPTION_KEYS[userAns]}. {q.options[userAns]}
                    </span>
                    <br />
                    <span className="ok">
                      ✓ Correct: {OPTION_KEYS[q.correct]}. {q.options[q.correct]}
                    </span>
                  </>
                )}
              </div>
              <div className="answer-explanation">{q.explanation}</div>
            </div>
          );
        })}
      </div>

      {/* Retry */}
      <button className="btn-primary" onClick={onRetry}>
        Try Another Quiz →
      </button>
    </div>
  );
};

export default ResultScreen;