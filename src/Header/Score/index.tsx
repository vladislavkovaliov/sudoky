import { useState, useEffect, useCallback } from "preact/hooks";

import styles from "./styles.module.css";

export function Score() {
  const [score, setScore] = useState(0);

  const handleScoreUpdateCallback = useCallback((value: number) => {
    setScore((x) => x + value);
  }, []);

  const handleClickCallback = useCallback(() => {
    window.eventEmitter.emit("score-click", {});
  }, []);

  useEffect(() => {
    window.eventEmitter.on("score", handleScoreUpdateCallback);
  }, [handleScoreUpdateCallback]);

  return (
    <div className={styles.container} onClick={handleClickCallback}>
      <p className={styles.title}>Score</p>
      <span className={styles.separator}>:</span>
      <p className={styles.value}>{score}</p>
    </div>
  );
}
