import { useState, useEffect, useCallback } from "preact/hooks";

import styles from "./styles.module.css";
import { getDifficultyFromUrlAndFlush } from "../../utils/getDifficultyFromUrlAndFlush";

export function Difficult() {
  const [diff, setDiff] = useState(() => {
    return getDifficultyFromUrlAndFlush("diff");
  });

  const handleDifficultCallback = useCallback((difficult: number) => {
    console.log("update diff", difficult);
    setDiff(difficult);
  }, []);

  useEffect(() => {
    window.eventEmitter.on("difficult", handleDifficultCallback);
  }, []);
  console.log(diff);
  return (
    <div className={styles.container}>
      <p className={styles.title}>Difficult</p>
      <span className={styles.separator}>:</span>
      <p className={styles.value}>{diff}</p>
    </div>
  );
}
