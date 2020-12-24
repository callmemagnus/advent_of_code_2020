import { loadFileByLine, println, run, title } from "../utilities";

enum TileColor {
  Black = "black",
  White = "white",
}

function updatePosition(position: string, vX: number, vY: number): string {
  const [x, y] = position.split("|").map((x) => Number(x));
  return `${x + vX}|${y + vY}`;
}

function countAdjacentBlack(hex, i, j) {
  let count = 0;
  const position = i + "|" + j;

  [
    updatePosition(position, 1, 0),
    updatePosition(position, 1, -1),
    updatePosition(position, 0, -1),
    updatePosition(position, -1, 0),
    updatePosition(position, -1, 1),
    updatePosition(position, 0, 1),
  ].forEach((position) => {
    const existing = hex[position];
    if (existing && existing === TileColor.Black) {
      count = count + 1;
    }
  });

  return count;
}

function dailyUpdate(
  hex: { [position: string]: TileColor },
  min: number,
  max: number
) {
  const newHex = {};

  for (let i = min; i <= max; i++) {
    for (let j = min; j <= max; j++) {
      const countBlack = countAdjacentBlack(hex, i, j);
      if (hex[i + "|" + j] === TileColor.Black) {
        if (countBlack === 0 || countBlack > 2) {
        } else {
          newHex[i + "|" + j] = TileColor.Black;
        }
      } else {
        if (countBlack === 2) {
          newHex[i + "|" + j] = TileColor.Black;
        } else {
        }
      }
    }
  }

  return newHex;
}

run(__dirname, (filepath) => {
  const lines = loadFileByLine(filepath);

  const hex = {};

  lines.forEach((line) => {
    const regexp = /^(?<i>e|se|sw|w|nw|ne)(?<r>.*)$/;
    let remaining = line;

    let lastPosition = "0|0";

    while (remaining !== "") {
      const { i, r } = regexp.exec(remaining).groups;

      switch (i) {
        case "e":
          lastPosition = updatePosition(lastPosition, 1, 0);
          break;
        case "se":
          lastPosition = updatePosition(lastPosition, 1, -1);
          break;
        case "sw":
          lastPosition = updatePosition(lastPosition, 0, -1);
          break;
        case "w":
          lastPosition = updatePosition(lastPosition, -1, 0);
          break;
        case "nw":
          lastPosition = updatePosition(lastPosition, -1, 1);
          break;
        case "ne":
          lastPosition = updatePosition(lastPosition, 0, 1);
          break;
      }
      remaining = r;
    }

    if (hex[lastPosition]) {
      hex[lastPosition] =
        hex[lastPosition] === TileColor.Black
          ? TileColor.White
          : TileColor.Black;
    } else {
      hex[lastPosition] = TileColor.Black;
    }
  });

  title("Part 1", 1);

  function amountOfBlackTiles(h) {
    return Object.values(h).reduce<number>((acc, value) => {
      if (TileColor.Black === value) {
        acc = acc + 1;
      }
      return acc;
    }, 0);
  }

  println("There are ", amountOfBlackTiles(hex), " black tiles");

  title("Part 2", 1);

  let day = 1;
  let art = hex;

  println(`Day 0: ${amountOfBlackTiles(art)} black tiles`);

  while (day <= 100) {
    art = dailyUpdate(art, -100, 100);
    (day <= 10 || day % 10 === 0) &&
      println(`Day ${day}: ${amountOfBlackTiles(art)} black tiles`);
    day = day + 1;
  }
});
