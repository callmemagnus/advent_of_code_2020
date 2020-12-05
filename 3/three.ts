import { countTrueInArray } from "../helpers";
import { loadFileByLineAndApply } from "../loadFile";

type TreeOrNot = "#" | ".";
type Pattern = TreeOrNot[][];

function load(filename: string): Pattern {
  const data = loadFileByLineAndApply<TreeOrNot[]>(
    filename,
    (line) => line.split("") as TreeOrNot[]
  );
  return data;
}

class Map {
  private map: Pattern;
  constructor(map: Pattern) {
    this.map = map;
  }
  isTree(point: number[]) {
    const [h, v] = point;
    return this.map[v][h % this.map[0].length] === "#";
  }
}

function countTreeOnPath(pattern: Pattern, h: number, v: number) {
  let count = 0;
  let current = [0, 0];

  const map = new Map(pattern);

  let out = false;
  while (!out) {
    current = [current[0] + h, current[1] + v];
    if (current[1] === pattern.length - 1) {
      out = true;
    }
    if (map.isTree(current)) {
      count = count + 1;
    }
  }

  return count;
}

function run() {
  ["./3/test.txt", "./3/data.txt"].forEach((filename) => {
    const one = load(filename);

    console.log(`Part one: ${filename}: ${countTreeOnPath(one, 3, 1)}`);

    console.log(
      `Part two: ${[
        [1, 1],
        [3, 1],
        [5, 1],
        [7, 1],
        [1, 2],
      ].reduce(
        (acc, slope) => acc * countTreeOnPath(one, slope[0], slope[1]),
        1
      )}`
    );
  });
}

run();
