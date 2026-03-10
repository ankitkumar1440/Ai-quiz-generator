import { useEffect, useRef } from "react";

/**
 * Timer component
 * @param {number} timeLeft - Seconds remaining
 * @param {function} onTick - Called every second with (timeLeft - 1)
 * @param {function} onExpire - Called when timer hits 0
 */
const Timer = ({ timeLeft, onTick, onExpire }) => {
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (timeLeft <= 1) {
        clearInterval(intervalRef.current);
        onExpire();
      } else {
        onTick(timeLeft - 1);
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const isUrgent = timeLeft <= 60;

  return (
    <div className={`timer ${isUrgent ? "urgent" : ""}`}>
      <span className="timer-icon">⏱</span>
      <span className="timer-display">{display}</span>
    </div>
  );
};

export default Timer;