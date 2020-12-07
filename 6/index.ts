import {
  println,
  run,
  title,
  loadFileBlockSeparatedByAnEmptyLine,
} from "../utilities";

run(__dirname, (filename) => {
  const groups = loadFileBlockSeparatedByAnEmptyLine(filename);

  title("One", 1);
  println(
    groups
      .map((line) => {
        return new Set(line.replace(/ /g, "").split(""));
      })
      .reduce((acc, group: Set<string>) => acc + group.size, 0)
  );
  title("Two", 1);
  println(
    groups
      .map((line) => {
        const persons = line.split(" ");
        const set = new Set(persons[0].split(""));

        for (let i = 1; i < persons.length; i++) {
          const letters = persons[i].split("");
          set.forEach((letter) => {
            if (!letters.includes(letter)) {
              set.delete(letter);
            }
          });
        }
        return set.size;
      })
      .reduce((acc, count) => acc + count)
  );
});
