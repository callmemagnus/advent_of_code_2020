import {
  loadFile,
  loadFileBlockSeparatedByAnEmptyLine,
  println,
  run,
  title,
} from "../utilities";

function buildRules(lines: string[]): Map<string, string> {
  const rules = new Map<string, string>();

  while (rules.size !== lines.length) {
    lines.forEach((line, index) => {
      const [num, rule] = line.split(": ");
      if (/[ab]+/.test(rule)) {
        rules.set(num, rule.replace(/"/g, ""));
      } else {
        const split = rule.split(" ");
        let r = [];

        for (let i = 0; i < split.length; i++) {
          const element = split[i];
          if (rules.has(element)) {
            const e = rules.get(element);
            if (/\|/.test(e)) {
              r.push(`(${e})`);
            } else {
              r.push(e);
            }
          } else if (element === "|") {
            r.push(element);
          } else {
            break;
          }
        }

        if (r.length === split.length) {
          rules.set(num, r.join(""));
        }
      }
    });
  }
  return rules;
}

function update8And11(
  rules: Map<string, string>,
  unparseRules: string[]
): string {
  const new8 = "42 | 42 8";
  const new11 = "42 31 | 42 11 31";

  //   const recursion = 5;
  //   let r0 = unparseRules.find((line) => /^0:/.test(line)).split(": ")[1];
  //   for (let i = 0; i < recursion; i++) {
  //     r0 = r0.replace("8", `(${new8})`).replace("11", `(${new11})`);
  //     println(i, r0);
  //   }

  //   r0 = r0.replace(`(${new8})`, "42").replace(`(${new11})`, "42 31");

  //   println("f", r0);

  // let r0 = "42{1,10}

  //   while (/\d/.test(r0)) {
  //     const matches = /(\d+)/g.exec(r0);
  //     println("m", matches[1]);
  //     r0 = r0
  //       .replace(
  //         new RegExp(matches[1], "g"),
  //         "(" + rules.get(matches[1]) + ")" //.replace(/^\(/, "").replace(/\)$/, "")
  //       )
  //       .replace(" ", "");
  //   }
  return `(${rules.get("42")})+(${rules.get("31")})+`;
}

run(__dirname, (filepath) => {
  const blocks = loadFile(filepath).split("\n\n");
  const unParsedRules = blocks[0].split("\n");

  title("Part 1", 1);
  const rules = buildRules(unParsedRules);
  const pattern = new RegExp(`^${rules.get("0")}$`);
  println(
    "Matching lines:",
    blocks[1]
      .split("\n")
      .reduce((acc, line) => acc + (pattern.test(line) ? 1 : 0), 0)
  );

  title("Part 2", 1);

  // new rules means the following but the quantity must match
  // 8  -> 42 | 42 8        -> 42+
  // 11 -> 42 31 | 42 11 31 -> 42{n} 31{n}
  let r0 = `(${rules.get("42")})+(${rules.get("42")}){x}(${rules.get(
    "31"
  )}){x}`;

  let rounds = 1;
  let count = 0;
  let done = false;

  while (!done && rounds < 20) {
    const newCount = blocks[1].split("\n").reduce((acc, line) => {
      const matches = new RegExp(
        `^${r0.replace(/x/g, rounds.toString())}$`
      ).test(line);
      if (matches) {
        acc = acc + 1;
      }
      return acc;
    }, 0);

    if (newCount > 0) {
      count = newCount + count;
    } else {
      done = true;
    }

    rounds = rounds + 1;
  }

  println("Matching lines:", count);
});
