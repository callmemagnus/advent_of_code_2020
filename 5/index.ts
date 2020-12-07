import { println, run, title, loadFileByLineAndApply } from "../utilities";

function load(filename: string) {
  return loadFileByLineAndApply(filename, (line: string) => {
    const rule = /^(.{7})(.{3})$/.exec(line);
    return [rule[1], rule[2]];
  }).map(([row, seat]) => [
    parseInt(row.replace(/F/g, "0").replace(/B/g, "1"), 2),
    parseInt(seat.replace(/L/g, "0").replace(/R/g, "1"), 2),
    parseInt(
      row.replace(/F/g, "0").replace(/B/g, "1") +
        seat.replace(/L/g, "0").replace(/R/g, "1"),
      2
    ),
  ]);
}

run(__dirname, (filename) => {
  const seats = load(filename).map(([row, seat, id]) => {
    //   const seatId = row * 8 + seat;
    //   console.log(seatId, id);
    return id;
  });

  seats.sort((a, b) => a - b);

  const min = seats[0];
  const max = seats[seats.length - 1];

  title("One", 1);

  println("highest", max);

  if (/data/.test(filename)) {
    title("Two", 1);
    for (let i = min; i < max - 1; i++) {
      if (!seats.includes(i)) {
        println("my seat", i);
      }
    }
  }
});
