import { countTrueInArray } from "../helpers";
import { loadFileByLineAndApply } from "../loadFile";

interface Line {
  min: number;
  max: number;
  letter: string;
  password: string;
}

function load(filename: string): Line[] {
  const data = loadFileByLineAndApply<Line>(filename, (item) => {
    const line = item.split(" ");
    const qBoundaries = line[0].split("-");
    const letter = line[1][0];
    const password = line[2];
    return {
      min: parseInt(qBoundaries[0], 10),
      max: parseInt(qBoundaries[1], 10),
      letter,
      password,
    };
  });
  return data;
}

function checkPassword({ password, letter, min, max }: Line) {
  const count = password
    .split("")
    .reduce(
      (acc: number, testedLetter) => (testedLetter === letter ? acc + 1 : acc),
      0
    );

  return min <= count && count <= max;
}

function checkPassword2({ password, letter, min, max }: Line) {
  const letters = password.split("");

  if (max > letters.length) {
    return letters[min - 1] === letter;
  }

  if (letters[min - 1] === letter && letters[max - 1] === letter) {
    return false;
  }

  return letters[min - 1] === letter || letters[max - 1] === letter;
}

function run() {
  ["./2/test.txt", "./2/data.txt"].forEach((filename) => {
    const one = load(filename).map((line) => checkPassword(line));
    console.log(`Part One: ${filename}: ${countTrueInArray(one)}`);

    const two = load(filename).map((line) => checkPassword2(line));
    console.log(`Part Two: ${filename}: ${countTrueInArray(two)}`);
  });
}

run();
