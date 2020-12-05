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
