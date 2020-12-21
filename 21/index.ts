import { loadFileByLine, println, run, title } from "../utilities";

function extractIngredients(lines: string[]) {
  const parsedList = [];

  lines.forEach((line) => {
    // println(line);
    const [a, b] = line.split(" (contains ");
    const ingredients = a.split(" ");
    const allergens = b.slice(0, b.length - 1).split(", ");

    // println(ingredients, allergens);

    parsedList.push([ingredients, allergens]);
  });
  return parsedList;
}

run(__dirname, (filepath) => {
  const ingredients = extractIngredients(loadFileByLine(filepath));

  const suspects = new Map<string, string[]>();
  const dictionary = new Map<string, string>();

  let done = false;
  ingredients.forEach(([i, a]) => {
    if (a.length) {
      a.forEach((allergen) => {
        if (suspects.has(allergen)) {
          const existingSuspects = suspects.get(allergen);
          const sharedList = [];
          existingSuspects.forEach((suspect) => {
            if (i.includes(suspect)) {
              sharedList.push(suspect);
            }
          });
          suspects.set(allergen, sharedList);
        } else {
          suspects.set(allergen, i);
        }
      });
    }
  });

  //   println(suspects);

  while (!done) {
    const it = suspects.entries();
    let next = it.next();

    while (!next.done) {
      const [allergen, possibleIngredients] = next.value;

      if (possibleIngredients.length === 1) {
        dictionary.set(possibleIngredients[0], allergen);
        suspects.delete(allergen);
      } else {
        suspects.set(
          allergen,
          possibleIngredients.filter(
            (possibleIngredient) => !dictionary.has(possibleIngredient)
          )
        );
      }

      next = it.next();
    }

    // println("suspects", suspects);
    // println("dictionary", dictionary);
    debugger;
    done = suspects.size === 0;
  }

  title("Part 1", 1);
  let count = 0;
  ingredients.forEach(([i, a]) => {
    i.forEach((ingredient) => {
      if (!dictionary.has(ingredient)) {
        count = count + 1;
      }
    });
  });
  println("dictionary", dictionary);

  println("result", count);

  title("Part 2", 2);

  const sorted = Array.from(dictionary.entries())
    .sort((a, b) => {
      if (a[1] > b[1]) return 1;
      else if (a[1] < b[1]) return -1;
      else return 0;
    })
    .map(([i, _]) => i);

  println(sorted.join(","));
});
