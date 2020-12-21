import { loadFile, println, run } from "../utilities";

const reverse = (str: string) => str.split("").reverse().join("");

const rotate90 = (str: string[]) => [
  reverse(str[3]),
  str[0],
  reverse(str[1]),
  str[2],
];

const flipH = (str: string[]) => [
  reverse(str[0]),
  str[3],
  reverse(str[2]),
  str[1],
];

const flipV = (str: string[]) => [
  str[2],
  reverse(str[1]),
  str[0],
  reverse(str[3]),
];

function extractImages(raw: string) {
  return raw.split("\n\n").map((rawImage) => {
    const split = rawImage.split("\n");
    const id = /Tile (?<id>\d+):/.exec(split.shift()).groups.id;

    const values = split.map((line) => line.split(""));

    const borders = [
      values[0].join(""),
      values.map((value) => value[value.length - 1]).join(""),
      values[values.length - 1].join(""),
      values.map((value) => value[0]).join(""),
    ];

    return {
      id,
      borders: [
        ...borders,
        ...rotate90(borders),
        ...flipH(rotate90(borders)),
        ...flipV(rotate90(borders)),
        ...rotate90(rotate90(borders)),
        ...flipH(rotate90(rotate90(borders))),
        ...flipV(rotate90(rotate90(borders))),
        ...flipH(rotate90(rotate90(rotate90(borders)))),
        ...flipV(rotate90(rotate90(rotate90(borders)))),
      ],
    };
  });
}

run(__dirname, (filepath) => {
  const raw = loadFile(filepath);
  const images = extractImages(raw);
  const map = new Map<string, string[]>();

  images.forEach(({ id, borders }) => {
    borders.forEach((border) => {
      const previous = map.get(border) || [];
      previous.push(id);
      map.set(border, previous);
    });
  });

  const countPerId = images.map(({ id, borders }) => {
    let count = 0;
    borders.forEach((border) => {
      const tileIdHavingBorder = map.get(border);
      count = count + tileIdHavingBorder.length - 1;
    });

    return { id, count };
  });

  println(countPerId.sort((a, b) => a.count - b.count));
  println(countPerId.slice(0, 4).reduce((acc, v) => acc * Number(v.id), 1));
});
