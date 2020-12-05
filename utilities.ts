import * as fs from "fs";
import * as path from "path";

export function run(dir, what: (filepath: string) => void) {
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

export function print(...params: any[]) {
  console.log(...params);
}
