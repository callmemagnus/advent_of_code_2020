import { loadFileByLine, println, run, title } from "../utilities";

function calculate(line: string): number {
  let split = line.split(" ");

  let currentOperation = null;
  let previousNumber = null;

  while (split.length) {
    const token = split.shift();

    if (!isNaN(Number(token))) {
      if (previousNumber) {
        previousNumber = eval(
          previousNumber + currentOperation + Number(token)
        );
      } else {
        previousNumber = Number(token);
      }
    } else if (["+", "*"].includes(token)) {
      currentOperation = token;
    }
  }

  return previousNumber;
}

function calculate2(line: string): number {
  while (/\+/.test(line)) {
    let s = /^(.*?)(\d+ \+ \d+)(.*)$/.exec(line);
    line = s[1] + eval(s[2]) + s[3];
  }
  return eval(line);
}

function parse(line: string, isPart2: boolean): number {
  const calc = isPart2 ? calculate2 : calculate;
  while (/\(/.test(line)) {
    const t = /(.*)\(([^()]+)\)(.*)/.exec(line);
    line = t[1] + calc(t[2]) + t[3];
  }
  return calc(line);
}

run(__dirname, (filepath) => {
  const lines = loadFileByLine(filepath);

  title("Part 1", 1);
  let results = lines.map((line) => parse(line, false));
  println(
    // results,
    results.reduce((acc, r) => acc + r)
  );

  title("Part 2", 1);
  results = lines.map((line) => parse(line, true));
  println(
    // results,
    results.reduce((acc, r) => acc + r)
  );
});
