import { countTrueInArray, println, run, title } from "../utilities";
import * as fs from "fs";

type Rule = {
  name: string;
  apply: (v: number) => boolean;
};

// function findCorrectMapping(
//   boundaries: ((v: number) => boolean)[],
//   ticket: number[]
// ) {
//   const mapping = new Map<number, (v: number) => boolean>();

//   while (mapping.size !== ticket.length) {
//     println(mapping.size, ticket.length, boundaries.length);
//     if (boundaries.length === 1) {
//       for (let i = 0; i < ticket.length; i++) {
//         if (!mapping.has(i)) {
//           mapping.set(i, boundaries[0]);
//           break;
//         }
//       }
//     }

//     const result = boundaries.map((b) => ticket.map((x) => b(x)));
//     const toRemove = new Set();
//     println(result);
//     return;
//     result.forEach((c, index) => {
//       if (countTrueInArray(c) === 1) {
//         mapping.set(c.indexOf(true), boundaries[index]);
//         toRemove.add(index);
//       }
//     });

//     boundaries = boundaries.reduce((acc, b, index) => {
//       if (toRemove.has(index)) {
//         return acc;
//       }
//       acc.push(b);
//       return acc;
//     }, []);
//   }
//   return mapping;
// }

function allValuesRespectRule(rule: Rule, numbers: number[]): boolean {
  return numbers.every((n) => rule.apply(n));
}

function assignRulesToValues(rules: Rule[], tickets: number[][]) {
  const correct = new Map<number, string>();
  const plausibleCandidates = new Map<number, Set<Rule>>();

  // let's prepare the candidates
  rules.forEach((rule) => {
    for (let i = 0; i < tickets[0].length; i++) {
      const values = tickets.map((values) => values[i]);
      if (allValuesRespectRule(rule, values)) {
        const currentCandidates = plausibleCandidates.get(i) || new Set();
        currentCandidates.add(rule);
        plausibleCandidates.set(i, currentCandidates);
      }
    }
  });

  while (correct.size < rules.length) {
    // println(correct.size, rules.length);
    const it = plausibleCandidates.entries();
    let next = it.next();
    while (!next.done) {
      const [index, rules]: [number, Set<Rule>] = next.value;
      if (rules.size === 1) {
        const rule = rules.values().next().value;
        correct.set(index, rule.name);
        plausibleCandidates.delete(index);
        plausibleCandidates.forEach((set) => {
          set.delete(rule);
        });
      }
      next = it.next();
    }
  }

  return correct;
}

run(__dirname, (filepath) => {
  const lines = fs.readFileSync(filepath).toString().split("\n");
  const blocks: string[][] = lines.reduce(
    (acc, line) => {
      if (/^$/.test(line)) {
        acc.push([]);
      } else {
        acc[acc.length - 1].push(line);
      }

      return acc;
    },
    [[]]
  );

  const rules: Rule[] = blocks[0].map((x) => {
    const ranges = /([a-z ]+): (\d+)-(\d+) or (\d+)-(\d+)/.exec(x);
    const boundaries = ranges.slice(2, 6).map((x) => Number(x));
    return {
      name: ranges[1],
      apply: (v: number) =>
        (boundaries[0] <= v && v <= boundaries[1]) ||
        (boundaries[2] <= v && v <= boundaries[3]),
    };
  });

  const ticketValue = blocks[1][1].split(",").map((x) => Number(x));
  const nearbyTicketValues = blocks[2]
    .slice(1)
    .map((x) => x.split(",").map((x) => Number(x)));

  title("Part 1", 1);
  const validForPart2 = [];

  println(
    "error rate",
    nearbyTicketValues.reduce((acc, ticket) => {
      let isValid = true;
      for (let i = 0; i < ticket.length; i++) {
        const value = ticket[i];
        const satisfiesAtLeastOne = rules.some((rule) => rule.apply(value));
        if (!satisfiesAtLeastOne) {
          isValid = false;
          acc = acc + value;
          break;
        }
      }

      if (isValid) {
        validForPart2.push(ticket);
      }

      return acc;
    }, 0)
  );

  title("Part 2", 1);

  const mapped = assignRulesToValues(rules, [...validForPart2]);

  let multiplyDeparture = 1;
  ticketValue.forEach((value, index) => {
    const label = mapped.get(index);
    if (/^departure/.test(label)) {
      multiplyDeparture = multiplyDeparture * value;
    }
    //println(label, value);
  });
  println('multplying all values starting with "departure"', multiplyDeparture);
});
