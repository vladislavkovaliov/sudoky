export function getRandomNumbers(): number[] {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (let i = numbers.length - 1; i >= 0; i--) {
    const randIndex = Math.floor(Math.random() * (i + 1));

    [numbers[i], numbers[randIndex]] = [numbers[randIndex], numbers[i]];
  }

  return numbers;
}
