import { loadFileByLine, println, run, title } from "../utilities";

type Instruction = [word: string, value: string];

function applyMask(mask: string, value: string): string {
  const m = mask.split("");
  const result = [...m].map((x) => (x === "X" ? "0" : x));
  const v = value.split("");

  for (let i = 0; i < v.length; i++) {
    const indexInResult = result.length - 1 - i;
    const indexInValue = v.length - 1 - i;
    if (m[indexInResult] === "X") {
      result[indexInResult] = v[indexInValue];
    }
  }
  return result.join("");
}

function process(instructions: Instruction[]): Map<string, number> {
  let mask = null;
  let mem = new Map<string, number>();

  for (let i = 0; i < instructions.length; i++) {
    const [word, value] = instructions[i];
    if (word === "mask") {
      mask = value;
    } else {
      const order = word.replace("mem[", "").replace("]", "");

      mem.set(order, parseInt(applyMask(mask, Number(value).toString(2)), 2));
    }
  }

  return mem;
}

function generateAddresses(address: string[]): string[] {
  let pattern = address.join("");
  let result: string[] = [pattern];

  const iteration = address.reduce((acc, letter) => {
    if (letter === "X") {
      acc = acc + 1;
    }
    return acc;
  }, 0);

  for (let i = 0; i < iteration; i++) {
    result = result.reduce((acc, address) => {
      // first add the current
      acc.push(address.replace(/X/, "0"));
      acc.push(address.replace(/X/, "1"));

      return acc;
    }, []);
  }

  return result;
}

function applyMask2(mask: string, address: string): string[] {
  const result = mask.split("");
  const a = address.split("");

  for (let i = 0; i < result.length; i++) {
    const indexInResult = result.length - 1 - i;
    const indexInValue = a.length - 1 - i;

    if (!["X", "1"].includes(result[indexInResult])) {
      result[indexInResult] = a[indexInValue] || "0";
    }
  }

  return generateAddresses(result);
}

function process2(instructions: Instruction[]): Map<string, number> {
  let mask = null;
  let mem = new Map<string, number>();

  for (let i = 0; i < instructions.length; i++) {
    const [word, value] = instructions[i];
    if (word === "mask") {
      mask = value;
    } else {
      const address = word.replace("mem[", "").replace("]", "");
      const addresses = applyMask2(mask, Number(address).toString(2));
      addresses.forEach((address) => {
        mem.set(address, Number(value));
      });
    }
  }

  return mem;
}

run(__dirname, (filepath) => {
  const lines = loadFileByLine(filepath)
    .reduce((acc, line) => {
      if (!/^#/.test(line)) {
        acc.push(line);
      }
      return acc;
    }, [])
    .map((line) => {
      return line.split(" = ");
    }) as Instruction[];

  const sum = (x: Map<any, number>) => {
    let result = 0;
    x.forEach((value) => {
      result = result + value;
    });
    return result;
  };

  let then = Date.now();
  title("Part 1", 1);
  println(sum(process(lines)), Date.now() - then);

  then = Date.now();
  title("Part 2", 1);
  println(sum(process2(lines)), Date.now() - then);
});
