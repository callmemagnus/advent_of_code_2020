import { loadFileBlockSeparatedByEmptyLines } from "../loadFile";

interface PassportData {
  byr?: string;
  iyr?: string;
  eyr?: string;
  hgt?: string;
  hcl?: string;
  ecl?: string;
  pid?: string;
  cid?: string;
}

interface IPassport {
  print: () => void;
  isValid: (mode: 1 | 2) => boolean;
}

class Passport implements IPassport {
  data: PassportData;
  constructor(data: PassportData) {
    this.data = data;
  }
  isValid(mode: 1 | 2 = 1) {
    const keys = Object.keys(this.data);

    if (keys.length < 7) {
      return false;
    }

    let isValid = true;

    const mandatoryFields = [
      "byr",
      "iyr",
      "eyr",
      "hgt",
      "hcl",
      "ecl",
      "pid",
      //   "cid",
    ];

    mandatoryFields.forEach((field) => {
      if (isValid && !keys.includes(field)) {
        // console.log(this.data, field);
        isValid = false;
      }
    });

    if (isValid && mode === 2) {
      // check values
      isValid = mandatoryFields.reduce((acc, field) => {
        if (!acc) {
          return acc;
        }
        const value = this.data[field];
        const num = parseInt(value, 10);

        switch (field) {
          case "byr":
            return num >= 1920 && num <= 2002;
          case "iyr":
            return num >= 2010 && num <= 2020;
          case "eyr":
            return num >= 2020 && num <= 2030;
          case "hgt":
            if (/cm/.test(value)) {
              return num >= 150 && num <= 193;
            } else if (/in/.test(value)) {
              return num >= 59 && num <= 76;
            }
            return false;
          case "hcl":
            return /^#[abcdef0-9]{6}$/.test(value);
          case "ecl":
            return ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(
              value
            );
          case "pid":
            return /^[0-9]{9}$/.test(value);
        }
      }, true);
    }

    // if (!isValid) {
    //   keys.sort();
    //   mandatoryFields.sort();

    //   //   console.log(keys, mandatoryFields);
    // }
    return isValid;
  }
  print() {
    console.log(this.data);
  }
}

function load(filename: string): IPassport[] {
  const lines = loadFileBlockSeparatedByEmptyLines(filename);

  const passports = lines.map((line) => {
    const pairs = line.split(" ");

    return pairs.reduce((acc, pair) => {
      const [key, value] = pair.split(":");
      if (!key || !value) {
        console.log(pair);
        console.log("caca", key, value);
        return acc;
      }
      acc[key] = value;
      return acc;
    }, {});
  });

  return passports.map((p) => new Passport(p));
}

const countTrue = (arr) => arr.filter((item) => item).length;

function run() {
  ["./4/test.txt", "./4/data.txt"].forEach((filename) => {
    const one = load(filename);

    console.log(`One: There are ${one.length} passports`);
    // one.map((p) => p.print());
    // console.log("one", one.length);
    console.log(filename, countTrue(one.map((p) => p.isValid(1))));
    console.log(filename, countTrue(one.map((p) => p.isValid(2))));
  });
}

run();
