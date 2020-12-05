import { loadFileByLineAndApply } from "../loadFile";

function findTwoSum2020(filename: string) {
  const numbers = loadFileByLineAndApply(filename, (item) =>
    parseInt(item, 10)
  );

  for (let i = 0; i < numbers.length - 1; i++) {
    const a = numbers[i];
    for (let j = i + 1; j < numbers.length; j++) {
      const b = numbers[j];
      if (a + b === 2020) {
        console.log(a, b, a * b);
        break;
      }
    }
  }
}

function findThreeSum2020(filename: string) {
  const numbers = loadFileByLineAndApply(filename, (item) =>
    parseInt(item, 10)
  );

  for (let i = 0; i < numbers.length - 1; i++) {
    const a = numbers[i];
    for (let j = i + 1; j < numbers.length; j++) {
      const b = numbers[j];
      for (let k = j + 1; k < numbers.length; k++) {
        const c = numbers[k];
        if (a + b + c === 2020) {
          console.log(a, b, c, a * b * c);
          break;
        }
      }
    }
  }
}

function findNSum2020(n: number, filename: string) {
  const numbers = loadFileByLineAndApply(filename, (item) =>
    parseInt(item, 10)
  );

  function findNThatSumsTo(
    sum: number,
    n: number,
    numbers: number[],
    currentChain: number[]
  ) {
    if (n === 1) {
      return numbers.includes(sum) ? [...currentChain, sum] : null;
    }
    for (let i = 0; i < numbers.length; i++) {
      const element = numbers[i];
      const remainingNumbers = [...numbers];
      remainingNumbers.splice(i);
      const result = findNThatSumsTo(sum - element, n - 1, remainingNumbers, [
        ...currentChain,
        element,
      ]);
      if (result) {
        return result;
      }
    }
  }

  return findNThatSumsTo(2020, n, numbers, []);
}

function run() {
  ["./test.txt", "./data.txt"].forEach((filename) => {
    console.log(`### ${filename} ###`);
    findTwoSum2020(filename);
    findThreeSum2020(filename);

    const two = findNSum2020(2, filename);
    const three = findNSum2020(3, filename);

    console.log(
      two,
      two.reduce((a, i) => a * i)
    );
    console.log(
      three,
      three.reduce((a, i) => a * i)
    );
  });
}

run();
