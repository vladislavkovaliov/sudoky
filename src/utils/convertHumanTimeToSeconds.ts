export function convertHumanTimeToSeconds(time: string): number {
  const [minutes, seconds] = time.split(":");

  const numMinutes = Number(minutes);
  const numSeconds = Number(seconds);

  return numMinutes * 60 + numSeconds;
}
