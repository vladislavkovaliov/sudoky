import { useState, useEffect, useCallback } from "preact/hooks";

import styles from "./styles.module.css";
import { getDifficultyFromUrlAndFlush } from "../../utils/getDifficultyFromUrlAndFlush";

export function Difficult() {
  const [diff, setDiff] = useState(() => {
    return getDifficultyFromUrlAndFlush("diff");
  });

  const handleDifficultCallback = useCallback((difficult: number) => {
    setDiff(difficult);
  }, []);

  useEffect(() => {
    window.eventEmitter.on("difficult", handleDifficultCallback);
  }, [handleDifficultCallback]);

  return (
    <div className={styles.container}>
      <p className={styles.title}>Difficult</p>
      <span className={styles.separator}>:</span>
      <p className={styles.value}>{diff}</p>
    </div>
  );
}
