import { loadFileByLineAndApply, println, run, title } from "../utilities";

type Direction = "N" | "S" | "E" | "W";
type Change = "L" | "R" | "F";
type Position = number[];
interface Instruction {
  instruction: "N" | "S" | "E" | "W" | "L" | "R" | "F";
  qty: number;
}

function turn(
  change: Change,
  qty: number,
  currentDirection: Direction
): Direction {
  const directions: Direction[] = ["N", "E", "S", "W"];
  const currentIndex = directions.indexOf(currentDirection);
  let delta = 1;
  if (qty === 180) {
    delta = 2;
  }
  if (qty === 270) {
    delta = 3;
  }

  const newIndex =
    (directions.length * 10 +
      currentIndex +
      (change === "L" ? -1 : 1) * delta) %
    directions.length;
  return directions[newIndex];
}

function move(
  currentDirection: Direction,
  qty: number,
  currentPosition: Position
): Position {
  switch (currentDirection) {
    case "E":
      return [currentPosition[0], currentPosition[1] + qty];
    case "N":
      return [currentPosition[0] + qty, currentPosition[1]];
    case "S":
      return [currentPosition[0] - qty, currentPosition[1]];

    case "W":
      return [currentPosition[0], currentPosition[1] - qty];
  }
}

function applyInstruction(
  { instruction, qty },
  currentDirection: Direction,
  currentPosition: Position
): [Direction, Position] {
  switch (instruction) {
    case "N":
      currentPosition[0] = currentPosition[0] + qty;
      break;
    case "S":
      currentPosition[0] = currentPosition[0] - qty;
      break;
    case "E":
      currentPosition[1] = currentPosition[1] + qty;
      break;
    case "W":
      currentPosition[1] = currentPosition[1] - qty;
      break;
    case "L":
    case "R":
      currentDirection = turn(instruction, qty, currentDirection);
      break;
    case "F":
      currentPosition = move(currentDirection, qty, currentPosition);
      break;
  }
  return [currentDirection, currentPosition];
}

function boat(instructions: Instruction[]): [Direction, Position] {
  let currentPosition: Position = [0, 0];
  let currentDirection: Direction = "E";

  instructions.forEach((i) => {
    const result = applyInstruction(i, currentDirection, currentPosition);
    currentDirection = result[0];
    currentPosition = result[1];
  });

  return [currentDirection, currentPosition];
}

function move2(
  currentWayPoint: Position,
  qty: number,
  currentPosition: Position
): Position {
  return [
    currentPosition[0] + currentWayPoint[0] * qty,
    currentPosition[1] + currentWayPoint[1] * qty,
  ];
}

function turn2(
  change: Change,
  qty: number,
  currentWaypointPosition: Position
): Position {
  if (qty === 180) {
    return [-currentWaypointPosition[0], -currentWaypointPosition[1]];
  }

  if ((qty === 90 && change === "L") || (qty === 270 && change === "R")) {
    return [currentWaypointPosition[1], -currentWaypointPosition[0]];
  } else {
    return [-currentWaypointPosition[1], currentWaypointPosition[0]];
  }
}

function applyInstruction2(
  { instruction, qty },
  currentWaypointPosition: Position,
  currentBoatPosition: Position
): [Position, Position] {
  switch (instruction) {
    case "N":
      currentWaypointPosition[0] = currentWaypointPosition[0] + qty;
      break;
    case "S":
      currentWaypointPosition[0] = currentWaypointPosition[0] - qty;
      break;
    case "E":
      currentWaypointPosition[1] = currentWaypointPosition[1] + qty;
      break;
    case "W":
      currentWaypointPosition[1] = currentWaypointPosition[1] - qty;
      break;
    case "L":
    case "R":
      currentWaypointPosition = turn2(
        instruction,
        qty,
        currentWaypointPosition
      );
      break;
    case "F":
      currentBoatPosition = move2(
        currentWaypointPosition,
        qty,
        currentBoatPosition
      );
      break;
  }
  return [currentWaypointPosition, currentBoatPosition];
}
function waypoint(instructions: Instruction[]) {
  let currentWaypointPosition: Position = [1, 10];
  let currentBoatPosition: Position = [0, 0];

  instructions.forEach((i) => {
    const result = applyInstruction2(
      i,
      currentWaypointPosition,
      currentBoatPosition
    );
    currentWaypointPosition = result[0];
    currentBoatPosition = result[1];
  });
  return [currentWaypointPosition, currentBoatPosition];
}

run(__dirname, (filepath) => {
  const instructions = loadFileByLineAndApply(filepath, (line) => {
    const [_, instruction, qty] = /^([A-Z])([0-9]{1,3})$/.exec(line);
    return {
      instruction,
      qty: parseInt(qty, 10),
    };
  }) as Instruction[];

  title("Part 1", 1);
  const result1 = boat(instructions);
  println(result1);
  println(`Manhattan: ${Math.abs(result1[1][0]) + Math.abs(result1[1][1])}`);

  title("Part 2", 1);
  const result2 = waypoint(instructions);
  println(result2);
  println(`Manhattan: ${Math.abs(result2[1][0]) + Math.abs(result2[1][1])}`);
});
