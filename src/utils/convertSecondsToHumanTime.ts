export function convertSecondsToHumanTime(totalSeconds: number) {
  let template = "_MINUTES_:_SECONDS_";

  let minutes = 0;
  let seconds = totalSeconds;

  if (seconds / 59 > 1) {
    minutes = Math.round(seconds / 59);
    seconds = totalSeconds % 60;
  }

  if (seconds > 9) {
    template = template.replace("_SECONDS_", seconds.toString());
  } else {
    template = template.replace("_SECONDS_", `0${seconds.toString()}`);
  }

  if (minutes > 9) {
    template = template.replace("_MINUTES_", minutes.toString());
  } else {
    template = template.replace("_MINUTES_", `0${minutes.toString()}`);
  }

  return template;
}
