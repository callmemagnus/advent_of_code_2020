import { loadFileByLineAndApply, println, run, title } from "../utilities";

type Seat = "#" | "L" | ".";

function isSame(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function copy(a) {
  return JSON.parse(JSON.stringify(a));
}

function occupancy(map: Seat[][], line: number, column: number) {
  let occupiedSeats = 0;

  for (let i = -1; i < 2; i = i + 1) {
    if (line + i >= 0 && line + i < map.length) {
      for (let j = -1; j < 2; j = j + 1) {
        if (
          column + j >= 0 &&
          column + j < map[0].length &&
          !(i === 0 && j === 0)
        ) {
          if (map[line + i][column + j] === "#") {
            occupiedSeats = occupiedSeats + 1;
          }
        }
      }
    }
  }
  return occupiedSeats;
}

function occupancy2(map: Seat[][], line: number, column: number) {
  let occupiedSeats = 0;

  for (let i = -1; i < 2; i = i + 1) {
    for (let j = -1; j < 2; j = j + 1) {
      if (!(i === 0 && j === 0)) {
        let over = false;
        let l = i;
        let c = j;
        while (!over) {
          if (
            line + l >= 0 &&
            line + l < map.length &&
            column + c >= 0 &&
            column + c < map[0].length
          ) {
            if (map[line + l][column + c] === "#") {
              occupiedSeats = occupiedSeats + 1;
              over = true;
            } else if (map[line + l][column + c] === "L") {
              over = true;
            } else {
              l = l === 0 ? 0 : (Math.abs(l) + 1) * (l / Math.abs(l));
              c = c === 0 ? 0 : (Math.abs(c) + 1) * (c / Math.abs(c));
            }
          } else {
            over = true;
          }
        }
      }
    }
  }
  return occupiedSeats;
}

function updateSeat(seat: Seat, occupancy: number) {
  if (seat === "L" && occupancy === 0) {
    return "#";
  }
  if (seat === "#" && occupancy >= 4) {
    return "L";
  }
  return seat;
}

function updateSeat2(seat: Seat, occupancy: number) {
  if (seat === "L" && occupancy === 0) {
    return "#";
  }
  if (seat === "#" && occupancy >= 5) {
    return "L";
  }
  return seat;
}

function show(map: Seat[][]) {
  println("");
  map.forEach((line) => println(line.join("")));
}

function oneRound(
  map: Seat[][],
  occupancy: (map: Seat[][], line: number, column: number) => number,
  updateSeat: (seat: Seat, occupancy: number) => string
) {
  const roundMap = [];
  for (let line = 0; line < map.length; line++) {
    roundMap[line] = [];
    for (let column = 0; column < map[0].length; column++) {
      roundMap[line][column] = ".";
      if (map[line][column] !== ".") {
        roundMap[line][column] = updateSeat(
          map[line][column],
          occupancy(map, line, column)
        );
      }
    }
  }
  return roundMap;
}

function countSeats(map: Seat[][]) {
  return map
    .map((line) => line.join())
    .join("")
    .replace(/[^#]/g, "").length;
}

function countRounds(map: Seat[][], occupancy, updateSeat) {
  let count = 0;
  let currentMap = copy(map);
  let same = false;

  do {
    const newMap = oneRound(currentMap, occupancy, updateSeat);

    same = isSame(newMap, currentMap);

    if (!same) {
      count = count + 1;
      currentMap = newMap;
      //   show(currentMap);
    }
  } while (!same);
  println(`occupied seats ${countSeats(currentMap)}`);

  return count;
}

run(__dirname, (filepath) => {
  const map = loadFileByLineAndApply(filepath, (line) =>
    line.trim().split("")
  ) as Seat[][];
  title("Part 1", 1);
  println(countRounds(map, occupancy, updateSeat));

  title("Part 2", 1);
  println(countRounds(map, occupancy2, updateSeat2));
});
