import { useState, useEffect } from "preact/hooks";

import { convertSecondsToHumanTime } from "../../utils/convertSecondsToHumanTime";

import styles from "./styles.module.css";

export const INIT_SECONDS_STATE = 0;

export const DELAY = 1000; // one second

export function Timer() {
  const [seconds, setSeconds] = useState(INIT_SECONDS_STATE);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((second) => second + 1);
    }, DELAY);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className={styles.container}>
      <p className={styles.title}>Time</p>
      <span className={styles.separator}>:</span>
      <p id="timer-value" className={styles.time}>
        {convertSecondsToHumanTime(seconds)}
      </p>
    </div>
  );
}
