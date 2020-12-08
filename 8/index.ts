import { loadFileByLineAndApply, println, run } from "../utilities";

function machine(
  instructions,
  accumulator = 0,
  position = 0,
  alreadyExecutedPositions = new Set()
) {
  let running = true;
  let failed = false;
  let permutationAllowed = true;
  const firstPosition = position;

  while (running && !failed) {
    let { instruction, number } = instructions[position];

    // return back in time
    if (
      ["jmp", "nop"].includes(instruction) &&
      permutationAllowed &&
      position !== firstPosition
    ) {
      permutationAllowed = false;
      if (instruction === "jmp") {
        instruction = "nop";
        println("Starting new machine");
        if (
          machine(instructions, accumulator, position, alreadyExecutedPositions)
        ) {
          println("hurray");
          return;
        }
        if (position + 1 === instructions.length) {
          console.log("goo");
          return;
        }
      } else if (instruction === "nop") {
        if (position + number === instructions.length) {
          console.log("goo");
          return;
        }
        println("Starting new machine");
        instruction = "jmp";
        if (
          machine(instructions, accumulator, position, alreadyExecutedPositions)
        ) {
          println("hurray");
          return;
        }
      }
    }

    alreadyExecutedPositions.add(position);

    switch (instruction) {
      case "acc":
        accumulator = accumulator + number;
      case "nop":
        position = position + 1;
        break;
      case "jmp":
        position = position + number;
        break;
    }

    if (position === instructions.length) {
      running = false;
    }

    if (alreadyExecutedPositions.has(position)) {
      failed = true;
    }

    // println(
    //   `accumulator: ${accumulator}, position: ${position} (after ${instruction}, ${number})`
    // );
  }

  if (!failed) {
    println(`Execution finished with accumulator ${accumulator}`);
  } else if (instructions.length > 100) {
    // println(`Execution failed with accumulator ${accumulator}`);
  }
  return !failed;
}

run(__dirname, (filepath) => {
  //   if (/data/.test(filepath)) return;
  const instructions = loadFileByLineAndApply(filepath, (line) => {
    const [instruction, number] = line.split(" ");
    return {
      instruction,
      number: parseInt(number, 10),
    };
  });

  machine(instructions, 0);
});
