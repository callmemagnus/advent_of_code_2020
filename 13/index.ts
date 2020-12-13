import {
  loadFileByLineAndApply,
  run,
  println,
  title,
  ppmc,
} from "../utilities";

// brut force, not suitable
function resolve2(busses: string[], start: number): number {
  let found = false;

  const constraints = busses.map((line, i) =>
    line === "x" ? false : parseInt(line, 10)
  );

  function optimizeContraints(constraints) {
    let biggest = null;
    const result = constraints
      .map((c, i) => ({
        delta: i,
        multiple: c,
      }))
      .filter(({ multiple }) => multiple)
      .map(({ delta, multiple }) => ({
        delta: delta % multiple,
        multiple,
      }))
      .reduce((acc, item) => {
        if (!acc[item.delta]) {
          acc[item.delta] = item.multiple;
        } else {
          acc[item.delta] = ppmc(acc[item.delta], item.multiple);
        }

        if (!biggest || biggest.multiple < acc[item.delta]) {
          biggest = { delta: item.delta, multiple: acc[item.delta] };
        }
        return acc;
      }, {});
    return [result, biggest];
  }

  const [optimizedContraints, biggest] = optimizeContraints(constraints);

  println(optimizedContraints);
  // find the biggest constraints

  const multiple = biggest.multiple;

  const delta = biggest.delta;
  let current = start;

  if (start !== 0) {
    while (current % multiple !== 0) {
      current = current + 1;
    }
    current = current - multiple;
  }
  println(`Started with ${current}, multiple: ${multiple}, delta: ${delta}`);

  function checkConstraints(num: number) {
    const deltas = Object.keys(optimizedContraints);

    for (let i = 0; i < deltas.length; i++) {
      const key = deltas[i];
      const multiple = optimizedContraints[key];
      const correctedNumber = num + parseInt(key, 10);
      if (correctedNumber % multiple !== 0) {
        return false;
      }
    }

    return true;
  }

  while (!found) {
    current = current + multiple;

    if (checkConstraints(current - delta)) {
      found = true;
    }
  }
  return current - delta;
}

run(__dirname, (filepath) => {
  const [estimatedDeparture, buses] = loadFileByLineAndApply(
    filepath,
    (line, i) => {
      if (i === 0) {
        return parseInt(line, 10);
      }
      return line
        .split(",")
        .map((x) => parseInt(x, 10))
        .filter((x) => x);
    }
  );

  title("Part 1", 1);

  const nearest: {
    arrival: number;
    number: number;
  }[] = (buses as number[]).map((n) => {
    let over = false;
    let current = 0;
    while (!over) {
      current = current + n;
      if (current > estimatedDeparture) {
        over = true;
      }
    }
    return {
      arrival: current,
      number: n,
    };
  });

  nearest.sort((a, b) => a.arrival - b.arrival);

  println(
    (nearest[0].arrival - (estimatedDeparture as number)) * nearest[0].number
  );

  title("Part 2", 1);

  const [busses2] = loadFileByLineAndApply(filepath, (line, i) => {
    if (i === 0) {
      return false;
    }
    return line.split(",");
  }).filter((x) => x);

  println(
    resolve2(busses2 as string[], /test/.test(filepath) ? 0 : 100000000000000)
  );
});
