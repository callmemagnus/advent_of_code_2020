import { println, title } from "../utilities";

function putAtTheEnd(arr: number[], n: number): number[] {
  const index = arr.indexOf(n);
  const result = [];
  for (let i = index + 1; i < arr.length + index + 1; i++) {
    result.push(arr[i % arr.length]);
  }
  return result;
}

function findNextDestination(arr: number[], previous: number): number {
  // label - 1
  const max = Math.max.apply(null, arr) + 1;
  let destination = previous;
  let found = false;

  while (!found) {
    destination = (max + destination - 1) % max;
    if (arr.indexOf(destination) >= 0) {
      found = true;
    }
  }

  return destination;
}

function updateCurrent(arr: number[], current: number) {
  const currentIndex = arr.indexOf(current);
  return arr[(currentIndex + 1) % arr.length];
}

function move(start: number[], current: number) {
  const newOrder = putAtTheEnd(start, current);
  const removed = newOrder.slice(0, 3);
  let remaining = newOrder.slice(3);
  //   title("New move", 2);
  //   println("Cups", start.map((x) => (x === current ? `(${x})` : x)).join(", "));

  //   println("Removed", removed.join(", "));

  const target = findNextDestination(remaining, current);
  remaining = putAtTheEnd(remaining, target);

  //   println(target, remaining);

  return [...removed, ...remaining];
}

function run1(start: string, iteration: number) {
  title("Part 1", 1);
  let cups = start.split("").map((x) => Number(x));
  let current = cups[0];

  let count = 0;

  while (count < iteration) {
    cups = move(cups, current);
    count = count + 1;
    current = updateCurrent(cups, current);
  }

  println("Result:", putAtTheEnd(cups, 1).slice(0, -1).join(""));
}

class Cup {
  value: number;
  next: Cup;
  constructor(value) {
    this.value = value;
    this.next = null;
  }
  toString() {
    return this.value.toString();
  }
}

function extend(first: Cup, qty: number) {
  let count = 1;
  let current = first;

  while (count < qty) {
    count = count + 1;
    if (!current.next) {
      current.next = new Cup(count);
    }
    current = current.next;
  }

  println(current.value);
  current.next = first;
}

function remove3(current: Cup): Cup {
  const r1 = current.next;
  const r2 = r1.next;
  const r3 = r2.next;
  current.next = r3.next;
  r3.next = null;
  return r1;
}

function copy(previous: Cup, removedCup: Cup, knownItems: Record<number, Cup>) {
  let current = removedCup;
  let possibleValue = ((1_000_000 + previous.value - 2) % 1_000_000) + 1;
  while (true) {
    // check if value not in removed
    const removedValues = [];
    while (current) {
      removedValues.push(current.value);
      current = current.next;
    }

    while (true) {
      if (removedValues.includes(possibleValue)) {
        possibleValue = ((1_000_000 + possibleValue - 2) % 1_000_000) + 1;
      } else {
        break;
      }
    }
    current = previous;

    if (knownItems[possibleValue]) {
      const x = knownItems[possibleValue];
      const previousNext = x.next;
      x.next = removedCup;
      removedCup.next.next.next = previousNext;
      return;
    }

    while (current) {
      if (!knownItems[current.value]) {
        knownItems[current.value] = current;
      }
      if (current.value === possibleValue) {
        const next = current.next;
        current.next = removedCup;
        removedCup.next.next.next = next;
        return;
      }

      current = current.next;
    }
  }
}

function print10Cups(start: Cup) {
  let current = start;
  const values = [];
  while (current && values.length < 15) {
    values.push(current.value);
    current = current.next;
  }
  println(values.join("->"));
}

function run2(start: string, iteration: number) {
  title("Part 2", 1);

  const firstCup = start
    .split("")
    .map((x) => Number(x))
    .reverse()
    .reduce((acc, value) => {
      if (!acc) {
        return new Cup(value);
      } else {
        const newCup = new Cup(value);
        newCup.next = acc;
        return newCup;
      }
    }, null as Cup);

  let currentCup = firstCup;

  extend(firstCup, 1_000_000);
  let count = 1;

  print10Cups(currentCup);

  // this is my new best friend
  const knownItems = {};

  while (count <= iteration) {
    // remove 3
    const firstRemoved = remove3(currentCup);
    copy(currentCup, firstRemoved, knownItems);
    // update current
    currentCup = currentCup.next;
    count = count + 1;
  }
  print10Cups(knownItems[1]);

  println(
    "part2 solution",
    knownItems[1].next.value * knownItems[1].next.next.value
  );
}

run1("389125467", 10);
run1("614752839", 100);

run2("389125467", 10_000_000);
run2("614752839", 10_000_000);
