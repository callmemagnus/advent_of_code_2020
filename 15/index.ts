import {
  loadFileByLine,
  loadFileByLineAndApply,
  println,
  run,
  title,
} from "../utilities";

type Game = number[];

function play(game: Game, length: number) {
  const lasts = new Map<number, number>();

  let counter = 1;
  let nextNumber = game[0];

  while (counter < length) {
    if (counter < game.length) {
      // special for the start
      lasts.set(nextNumber, counter);
      nextNumber = game[counter];
    } else {
      if (lasts.has(nextNumber)) {
        const previousPosition = lasts.get(nextNumber);
        lasts.set(nextNumber, counter);
        nextNumber = counter - previousPosition;
      } else {
        lasts.set(nextNumber, counter);
        nextNumber = 0;
      }
    }
    counter = counter + 1;
  }

  return nextNumber;
}

run(__dirname, (filepath) => {
  const games = loadFileByLineAndApply(filepath, (line) => {
    return line.split(",").map((x) => Number(x));
  }) as Game[];

  title("Part 1", 1);
  const result = games.map((game) => play(game, 2020));
  println(result);

  title("Part 2", 1);
  const result2 = games.map((game) => play(game, 30000000));
  println(result2);
});
