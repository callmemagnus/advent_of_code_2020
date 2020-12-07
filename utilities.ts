import * as fs from "fs";
import * as path from "path";

export function loadFile(filename: string): string {
  return fs.readFileSync(path.resolve(__dirname, filename)).toString().trim();
}

export function loadFileBlockSeparatedByAnEmptyLine(
  filename: string
): string[] {
  return loadFile(filename)
    .replace(/([^\n])\n/g, "$1 ") // yes, ugly as hell
    .replace(/\n\n/g, "\n")
    .split("\n")
    .map((line) => line.trim());
}

export function loadFileByLine(filename: string): string[] {
  return loadFile(filename)
    .split("\n")
    .filter((x) => x);
}

export function loadFileByLineAndApply<T>(
  filename: string,
  transformation: (item: string, index: number) => T
): T[] {
  return loadFileByLine(filename)
    .map((line) => line.trim())
    .map(transformation);
}

export function run(dir: string, what: (filepath: string) => void) {
  ["test.txt", "data.txt"].forEach((file) => {
    const filename = path.resolve(dir, file);
    if (fs.statSync(filename)) {
      title(`.: ${path.basename(filename)} :.`);
      what(filename);
    }
  });
}

export function title(str: string, level: number = 0) {
  function hash(quantity: number): string {
    let result = "";
    for (let i = 0; i < quantity; i++) {
      result = result + "#";
    }
    return result;
  }
  if (level === 0) {
    console.log(hash(str.length + 4));
    console.log(`${hash(1)} ${str} ${hash(1)}`);
    console.log(hash(str.length + 4));
  } else {
    console.log(`${hash(level)} ${str}`);
  }
}

export function println(...params: any[]) {
  console.log(...params);
}

export function countTrueInArray(arr: boolean[]): number {
  return arr.reduce((acc: number, bool: boolean) => (bool ? acc + 1 : acc), 0);
}
