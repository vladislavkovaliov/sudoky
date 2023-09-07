import { useState } from "preact/hooks";

import styles from "./styles.module.css";
import { getDifficultyFromUrlAndFlush } from "../../utils/getDifficultyFromUrlAndFlush";

export function Difficult() {
  const [diff] = useState(() => {
    return getDifficultyFromUrlAndFlush("diff");
  });

  return (
    <div className={styles.container}>
      <p className={styles.title}>Difficult</p>
      <span className={styles.separator}>:</span>
      <p className={styles.value}>{diff}</p>
    </div>
  );
}
