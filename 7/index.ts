import { println, run, loadFileByLineAndApply } from "../utilities";

function recursiveParents(
  what: string,
  rules: { [child: string]: { parent: string; qty: number }[] },
  listOfParents: Set<string>
) {
  const pattern = new RegExp(what);

  const parents = rules[Object.keys(rules).find((key) => pattern.test(key))];

  if (!parents) {
    return listOfParents;
  }

  parents.forEach(({ parent }) => {
    listOfParents.add(parent);
    const response = recursiveParents(parent, rules, listOfParents);
    response.forEach((p) => {
      listOfParents.add(p);
    });
  });

  return listOfParents;
}

function recursiveQty(
  what: string,
  rules: { parent: string; children: { qty: number; bag: string }[] }[],
  count: number
) {
  const pattern = new RegExp(what);

  const rule: {
    parent: string;
    children: { qty: number; bag: string }[];
  } = rules.find(({ parent }) => pattern.test(parent));
  if (!rule.children) {
    return 1;
  }

  if (!rule) {
    return count;
  }

  return (
    1 +
    count +
    rule.children.reduce((acc, { qty, bag }) => {
      return acc + qty * recursiveQty(bag, rules, count);
    }, 0)
  );
}

run(__dirname, (file) => {
  //   if (/data/.test(file)) return;
  const rules = loadFileByLineAndApply(file, (item) => {
    const [parent, other] = item
      .replace(/\.$/, "")
      .replace(/ bags?/g, "")
      .split(" contain ");

    const children = /no other/.test(other.trim())
      ? null
      : other.split(",").map((child) => {
          const [_, qty, bag] = /(\d+) (.*)$/.exec(child.trim());
          return {
            qty: parseInt(qty, 10),
            bag,
          };
        });

    return { parent, children };
  });

  const childrenToParents = {};

  rules.forEach((rule) => {
    if (rule.children) {
      rule.children.forEach(({ bag, qty }) => {
        if (!childrenToParents[bag]) {
          childrenToParents[bag] = [];
        }
        childrenToParents[bag].push({
          parent: rule.parent,
          qty,
        });
      });
    }
  });

  //   println(rules);
  //   println(childrenToParents);

  println(recursiveParents("shiny gold", childrenToParents, new Set()).size);
  println(recursiveQty("shiny gold", rules, 0) - 1);
});
