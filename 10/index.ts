import { basename } from "path";
import { loadFileByLineAndApply, println, run } from "../utilities";

function deltas(adapters: number[]) {
  const device = Math.max.apply(null, adapters) + 3;

  const sorted = [...adapters, device].sort((a, b) => a - b);

  let previous = 0;

  return sorted.reduce((acc, adapter) => {
    const diff = adapter - previous;
    if (!acc[diff]) {
      acc[diff] = 0;
    }
    acc[diff] = acc[diff] + 1;
    previous = adapter;
    return acc;
  }, {});
}

function countPossibleChains(adapters: number[]) {
  const device = Math.max.apply(null, adapters) + 3;

  const sorted = [...adapters, 0, device].sort((a, b) => a - b);

  let memo = {
    [sorted.length - 2]: 1,
  };

  for (let i = sorted.length - 3; i >= 0; i--) {
    memo[i] = 0;
    for (let j = 1; j <= 3; j++) {
      if (i + j < sorted.length && sorted[i + j] - sorted[i] <= 3) {
        memo[i] = memo[i] + memo[i + j];
      }
    }
  }

  return memo[0];
}

run(__dirname, (filepath) => {
  const adapters = loadFileByLineAndApply(filepath, (line) =>
    parseInt(line.trim(), 10)
  );
  const result = deltas(adapters);

  println(result, result[1] * result[3]);

  println(countPossibleChains(adapters));
});
