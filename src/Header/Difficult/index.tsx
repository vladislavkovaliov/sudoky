import styles from "./styles.module.css";

export function Difficult() {
  return (
    <div className={styles.container}>
      <p className={styles.title}>Difficult</p>
      <span className={styles.separator}>:</span>
      <p className={styles.value}>30</p>
    </div>
  );
}
