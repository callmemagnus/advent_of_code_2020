import { loadFileByLine, println, run } from "../utilities";

function findTwoThatSums(numbers: number[], sum: number) {
  let found = false;
  for (let i = 0; i < numbers.length - 1; i++) {
    const a = numbers[i];
    for (let j = i + 1; j < numbers.length; j++) {
      const b = numbers[j];
      if (a + b === sum) {
        found = true;
        break;
      }
    }
  }
  return found;
}

function findFirst(lines: number[], index: number, searchDepth: number) {
  let notFound = true;
  let currentSum;

  while (notFound) {
    currentSum = lines[index];
    notFound = findTwoThatSums(
      lines.slice(index - searchDepth, index),
      currentSum
    );
    index = index + 1;
  }
  return currentSum;
}

function findContiguousSum(lines: number[], sum: number) {
  let notFound = true;
  let summedNumbers = [];
  let startIndex = 0;

  while (notFound) {
    let currentSum = 0;
    summedNumbers = [];
    startIndex = startIndex + 1;
    for (let i = startIndex; i < lines.length; i++) {
      currentSum = currentSum + lines[i];
      summedNumbers.push(lines[i]);
      if (currentSum === sum) {
        notFound = false;
        break;
      }
      if (currentSum > sum) {
        break;
      }
    }
  }

  return summedNumbers;
}

function sumMinMax(numbers: number[]) {
  return Math.min.apply(null, numbers) + Math.max.apply(null, numbers);
}

run(__dirname, (filepath) => {
  //   if (/data/.test(filepath)) return;
  const lines = loadFileByLine(filepath).map((line) =>
    parseInt(line.trim(), 10)
  );

  const invalid = /test/.test(filepath)
    ? findFirst(lines, 5, 5)
    : findFirst(lines, 25, 25);

  println(sumMinMax(findContiguousSum(lines, invalid)));
});
