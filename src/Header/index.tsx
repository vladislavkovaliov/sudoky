import { Timer } from "./Timer";
import { Difficult } from "./Difficult";
import { Score } from "./Score";

import styles from "./styles.module.css";

export function Header() {
  return (
    <div className={styles.container}>
      <Difficult />
      <Score />
      <Timer />
    </div>
  );
}
