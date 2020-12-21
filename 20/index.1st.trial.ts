// this fails at the last line of the image reconstruction
// :-(
// Part 1 is solved the brute force way in the index.ts

import { loadFile, println, run } from "../utilities";

type Pixel = "#" | ".";

type State =
  | "original"
  | "flipH"
  | "flipV"
  | "90"
  | "90flipH"
  | "90flipV"
  | "rot180"
  | "rot-90"
  | "-90flipH"
  | "-90flipV";

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

class Image {
  id: string;
  values: Pixel[][];
  private originalBorders: string[];
  borders: string[];
  state: State;

  constructor(id: string, values: Pixel[][]) {
    this.id = id;
    this.values = values;
    this.originalBorders = [
      values[0].join(""),
      values.map((value) => value[value.length - 1]).join(""),
      values[values.length - 1].join(""),
      values.map((value) => value[0]).join(""),
    ];
    this.borders = this.originalBorders;
    this.state = "original";
  }

  change() {
    switch (this.state) {
      case "original":
        this.state = "flipH";
        this.borders = flipH(this.originalBorders);
        break;
      case "flipH":
        this.state = "flipV";
        this.borders = flipV(this.originalBorders);
        break;
      case "flipV":
        this.state = "90";
        this.borders = rotate90(this.originalBorders);
        break;
      case "90":
        this.state = "90flipH";
        this.borders = flipH(rotate90(this.originalBorders));
        break;
      case "90flipH":
        this.state = "90flipV";
        this.borders = flipV(rotate90(this.originalBorders));
        break;
      case "90flipV":
        this.state = "rot180";
        this.borders = rotate90(rotate90(this.originalBorders));
        break;
      case "rot180":
        this.state = "rot-90";
        this.borders = rotate90(rotate90(rotate90(this.originalBorders)));
        break;
      case "rot-90":
        this.state = "-90flipH";
        this.borders = flipH(
          rotate90(rotate90(rotate90(this.originalBorders)))
        );
        break;
      case "-90flipH":
        this.state = "-90flipV";
        this.borders = flipV(
          rotate90(rotate90(rotate90(this.originalBorders)))
        );
        break;
      case "-90flipV":
        this.state = "original";
        this.borders = this.originalBorders;
        throw new Error("STOP");
    }
  }
}

function extractImages(raw: string): Image[] {
  return raw.split("\n\n").map((rawImage) => {
    const split = rawImage.split("\n");
    const id = /Tile (?<id>\d+):/.exec(split.shift()).groups.id;

    const values = split.map((line) =>
      line.split("").map((char) => char as Pixel)
    );

    return new Image(id, values);
  });
}

function imagePrintId(images: Image[][]) {
  println("---");
  images.forEach((line, index) => {
    println(
      `${(index + 1).toString().padStart(2)}:`,
      line.map((image) => image.id).join(" ")
    );
  });
  println("---");
}

function deepDive(
  size: number,
  tiles: Image[],
  tilesInDive: Image[][],
  used: Set<string>
): Image[][] {
  let amountOfLines = tilesInDive.length;
  let amountOfColumns = tilesInDive[amountOfLines - 1].length;

  let x = amountOfLines - 1;
  let y = amountOfColumns;

  if (amountOfColumns === size) {
    if (amountOfLines === size) {
      imagePrintId(tilesInDive);

      return tilesInDive;
    }
    x = x + 1;
    tilesInDive[x] = [];
    y = 0;
  }

  x === 11 && imagePrintId(tilesInDive);

  for (let i = 0; i < tiles.length; i++) {
    const currentTile = tiles[i];

    if (used.has(currentTile.id)) {
      continue;
    }

    // let's try this tile in all configurations
    let done = false;
    let rightBorder = null;
    let bottomBorder = null;

    // 0: 0 1
    // 1: 0 1

    if (y > 0) {
      rightBorder = tilesInDive[x][y - 1].borders[1];
    }
    if (x >= 1) {
      bottomBorder = tilesInDive[x - 1][y].borders[2];
    }

    while (!done) {
      x === 11 &&
        println(
          currentTile.id,
          rightBorder,
          currentTile.borders[3],
          bottomBorder,
          currentTile.borders[0]
        );

      let ok = true;
      if (rightBorder) {
        ok = rightBorder === currentTile.borders[3];
      }
      if (bottomBorder) {
        ok = ok && bottomBorder === currentTile.borders[0];
      }

      if (ok) {
        done = true;
        tilesInDive[x][y] = currentTile;
        const currentUsed = new Set(used);
        currentUsed.add(currentTile.id);
        return deepDive(size, tiles, tilesInDive, currentUsed);
      }

      try {
        currentTile.change();
      } catch (e) {
        done = true;
      }
    }
  }

  return null;
}

run(__dirname, (filepath) => {
  const raw = loadFile(filepath);
  const images = extractImages(raw);
  let solution;

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    // println("Starting with", image.id);
    // println("Size", Math.sqrt(images.length));
    solution = deepDive(
      Math.sqrt(images.length),
      extractImages(raw),
      [[image]],
      new Set([image.id])
    );

    if (solution) {
      imagePrintId(solution);
      break;
    }
  }

  if (solution) {
    println(
      [
        solution[0][0],
        solution[solution.length - 1][0],
        solution[0][solution.length - 1],
        solution[solution.length - 1][solution.length - 1],
      ].reduce((acc, value) => acc * Number(value.id), 1)
    );
  } else {
    println("Not found");
  }
});
