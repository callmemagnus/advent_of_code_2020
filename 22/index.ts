import {
  loadFileBlockSeparatedByAnEmptyLine,
  println,
  run,
  title,
} from "../utilities";

interface Deck {
  id: string;
  cards: number[];
}

function extractDecks(blocks: string[]): Deck[] {
  return blocks.map((line) => {
    const match = /^Player (?<id>\d+): (?<cards>.*)$/.exec(line);
    return {
      id: match.groups.id,
      cards: match.groups.cards.split(" ").map((x) => Number(x)),
    };
  });
}

function game1(a: Deck, b: Deck): string {
  const cardA = a.cards.shift();
  const cardB = b.cards.shift();

  if (cardA > cardB) {
    a.cards.push(cardA);
    a.cards.push(cardB);
  } else {
    b.cards.push(cardB);
    b.cards.push(cardA);
  }

  return haveWinner(a, b);
}

function haveWinner(a: Deck, b: Deck): string {
  if (a.cards.length === 0) {
    return b.id;
  }
  if (b.cards.length === 0) {
    return a.id;
  }
  return null;
}

let count = 0;

function game2(a: Deck, b: Deck) {
  const previousHands = new Set<string>();
  count += 1;

  // println(
  //   a.cards.map(() => "^").join(""),
  //   "-",
  //   b.cards.map(() => "v").join("")
  // );

  // title(`New game ${count}`, 2);

  function round(a: Deck, b: Deck) {
    const hands = `${a.cards.join(",")}-${b.cards.join(",")}`;
    if (previousHands.has(hands)) {
      // player one wins
      // println("Already played... Player 1 wins");
      return a.id;
    }
    previousHands.add(hands);

    // println("Player", a.id, "has", a.cards);
    // println("Player", b.id, "has", b.cards);

    const cardA = a.cards.shift();
    const cardB = b.cards.shift();

    // println("Player", a.id, "plays", cardA);
    // println("Player", b.id, "plays", cardB);

    if (a.cards.length >= cardA && b.cards.length >= cardB) {
      // recursive game
      // println("Sub Game");
      const subGameWinner = game2(
        { id: a.id, cards: a.cards.slice(0, cardA) },
        { id: b.id, cards: b.cards.slice(0, cardB) }
      );

      count -= 1;

      if (subGameWinner === a.id) {
        // println("Player", a.id, "wins!");
        a.cards.push(cardA);
        a.cards.push(cardB);
      } else {
        // println("Player", b.id, "wins!");
        b.cards.push(cardB);
        b.cards.push(cardA);
      }
    } else {
      if (cardA > cardB) {
        // println("Player", a.id, "wins!");
        a.cards.push(cardA);
        a.cards.push(cardB);
      } else {
        // println("Player", b.id, "wins!");
        b.cards.push(cardB);
        b.cards.push(cardA);
      }
    }

    return haveWinner(a, b);
  }

  let winner = null;

  while (!winner) {
    // println("New Round");
    winner = round(a, b);
  }
  return winner;
}

run(__dirname, (filepath) => {
  const decks = extractDecks(loadFileBlockSeparatedByAnEmptyLine(filepath));

  let winner = null;

  while (!winner) {
    winner = game1(decks[0], decks[1]);
  }
  title("Part 1", 1);

  let winnerDeck = decks.find(({ id }) => id === winner);

  println(
    winner,
    // winnerDeck,
    winnerDeck.cards.reverse().reduce((acc, value, index) => {
      return acc + value * (index + 1);
    }, 0)
  );

  // if (/test/.test(filepath)) {
  title("Part2", 1);
  const decks2 = extractDecks(loadFileBlockSeparatedByAnEmptyLine(filepath));
  winner = null;
  let count = 0;
  while (!winner && count < 10) {
    winner = game2(decks2[0], decks2[1]);
    count += 1;

    println("---------------------------", count);
  }

  println(winner);

  winnerDeck = decks2.find(({ id }) => id === winner);

  println(
    winner,
    winnerDeck,
    winnerDeck.cards.reverse().reduce((acc, value, index) => {
      return acc + value * (index + 1);
    }, 0)
  );
  // }
});
