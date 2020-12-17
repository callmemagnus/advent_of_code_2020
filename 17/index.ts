import { loadFile, println, run, title } from "../utilities";

type Position = [number, number, number];
type HyperPosition = [number, number, number, number];

function getNeighbors(position: Position | HyperPosition): Position[] {
  const cubes = [];

  if (position.length === 3) {
    for (let x = position[0] - 1; x <= position[0] + 1; x++) {
      for (let y = position[1] - 1; y <= position[1] + 1; y++) {
        for (let z = position[2] - 1; z <= position[2] + 1; z++) {
          if (!(x === position[0] && y === position[1] && z === position[2])) {
            cubes.push([x, y, z]);
          }
        }
      }
    }
  } else {
    for (let w = position[0] - 1; w <= position[0] + 1; w++) {
      for (let x = position[1] - 1; x <= position[1] + 1; x++) {
        for (let y = position[2] - 1; y <= position[2] + 1; y++) {
          for (let z = position[3] - 1; z <= position[3] + 1; z++) {
            if (
              !(
                w === position[0] &&
                x === position[1] &&
                y === position[2] &&
                z === position[3]
              )
            ) {
              cubes.push([w, x, y, z]);
            }
          }
        }
      }
    }
  }
  return cubes;
}

function countActiveNeighbors(
  universe: Set<string>,
  position: Position | HyperPosition
): number {
  return getNeighbors(position).reduce((acc, p) => {
    if (universe.has(toString(p))) {
      acc = acc + 1;
    }
    return acc;
  }, 0);
}

function toString(cube: Position | HyperPosition): string {
  return cube.join("|");
}

function getRanges(universe: Set<string>) {
  let w = [];
  let x = [];
  let y = [];
  let z = [];

  universe.forEach((p) => {
    const numbers = p.split("|");
    if (numbers.length === 3) {
      x.push(Number(numbers[0]));
      y.push(Number(numbers[1]));
      z.push(Number(numbers[2]));
    } else {
      w.push(Number(numbers[0]));
      x.push(Number(numbers[1]));
      y.push(Number(numbers[2]));
      z.push(Number(numbers[3]));
    }
  });
  return {
    w:
      w.length === 0
        ? null
        : [Math.min.apply(null, w) - 1, Math.max.apply(null, w) + 1],
    x: [Math.min.apply(null, x) - 1, Math.max.apply(null, x) + 1],
    y: [Math.min.apply(null, y) - 1, Math.max.apply(null, y) + 1],
    z: [Math.min.apply(null, z) - 1, Math.max.apply(null, z) + 1],
  };
}

function cycle(universe: Set<string>): Set<string> {
  const ranges = getRanges(universe);
  const newUniverse = new Set<string>();

  if (ranges.w) {
    for (let w = ranges.w[0]; w <= ranges.w[1]; w++) {
      for (let x = ranges.x[0]; x <= ranges.x[1]; x++) {
        for (let y = ranges.y[0]; y <= ranges.y[1]; y++) {
          for (let z = ranges.z[0]; z <= ranges.z[1]; z++) {
            const position = toString([w, x, y, z]);
            const count = countActiveNeighbors(universe, [w, x, y, z]);

            if (universe.has(position)) {
              if (count === 2 || count === 3) {
                newUniverse.add(position);
              }
            } else {
              if (count === 3) {
                newUniverse.add(position);
              }
            }
          }
        }
      }
    }
  } else {
    for (let x = ranges.x[0]; x <= ranges.x[1]; x++) {
      for (let y = ranges.y[0]; y <= ranges.y[1]; y++) {
        for (let z = ranges.z[0]; z <= ranges.z[1]; z++) {
          const position = toString([x, y, z]);
          const count = countActiveNeighbors(universe, [x, y, z]);

          if (universe.has(position)) {
            if (count === 2 || count === 3) {
              newUniverse.add(position);
            }
          } else {
            if (count === 3) {
              newUniverse.add(position);
            }
          }
        }
      }
    }
  }
  return newUniverse;
}

run(__dirname, (filepath) => {
  let universe = loadFile(filepath)
    .split("\n")
    .reduce((acc, line, x) => {
      const z = 0;
      line.split("").forEach((value, y) => {
        if ("#" === value) {
          acc.add(toString([x, y, z]));
        }
      });
      return acc;
    }, new Set<string>());

  let step = 1;
  title("Part 1", 1);
  println(step, universe.size);
  while (step <= 6) {
    universe = cycle(universe);
    println(step, universe.size);
    step = step + 1;
  }

  universe = loadFile(filepath)
    .split("\n")
    .reduce((acc, line, x) => {
      const z = 0;
      const w = 0;
      line.split("").forEach((value, y) => {
        if ("#" === value) {
          acc.add(toString([w, x, y, z]));
        }
      });
      return acc;
    }, new Set<string>());

  step = 1;
  title("Part 2", 1);
  println(step, universe.size);
  while (step <= 6) {
    universe = cycle(universe);
    println(step, universe.size);
    step = step + 1;
  }
});
