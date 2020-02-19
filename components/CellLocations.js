export function findNextAcrossCell(num, cellArray) {
  return (num + 1) % totalCells;
}

export function findPreviousAcrossCell(num, cellArray) {
  return (num - 1) % totalCells;
}

export function findNextAcrossClue(num, cellArray) {
  // console.log('in find next across clue')
  /*keep adding to the index until you hit a cell that
  is not a black cell and is either...
  the start of a new row or to the right of a black cell
  */
  let index = 1;

  //max to search would be 2 rows worth...
  while (index < 2 * Math.sqrt(cellArray.length)) {
    // console.log('index: ', index)
    let currentCellIndex = (num + index) % cellArray.length;

    //if it's a black cell, go to the next
    if (cellArray[currentCellIndex].answer == ".") {
      index++;
      continue;
    }
    //else not a black cell

    //if this cell is the start of a new row
    if (currentCellIndex % Math.sqrt(cellArray.length) == 0) {
      return currentCellIndex;
    }

    //or if the previous cell is a black cell
    if (cellArray[currentCellIndex - 1].answer == ".") {
      return currentCellIndex;
    }

    index++;
    continue;
  }
}

export function findPreviousAcrossClue(num, cellArray) {
  let currentClue = cellArray[num].across;
  let previousClue;

  //find previous clue
  for (let i = 1; i < Math.sqrt(cellArray.length); i++) {
    let currentCellIndex = (num - i) % cellArray.length;
    let currentCell = cellArray[currentCellIndex];

    //skip blank cells
    if (currentCell.answer == ".") {
      continue;
    }

    if (currentCell.across !== currentClue) {
      previousClue = currentCell.across;
      break;
    }
  }

  for (let i = 0; i < 2 * Math.sqrt(cellArray.length); i++) {
    let currentCellIndex =
      (num + i - 2 * Math.sqrt(cellArray.length)) % cellArray.length;
    // console.log('current index: ', currentCellIndex)
    let currentCell = cellArray[currentCellIndex];
    // console.log('current clue: ', currentCell.across)
    if (currentCell.across == previousClue) {
      return currentCellIndex;
    }
  }
}

export function findNextDownCell(num, cellArray) {
  //if it's not the end of the word, go to the next char of the down word
  //if it's the end of the word, go to the next down clue start (go to the top of the down clue)
  //add to index until you hit a cell either in the top row, or with a blank cell above it
  //edge cases last down clue, end of board

  //to determine if end of word, then check to see if the cell below is not empty
  let rowLength = Math.sqrt(cellArray.length);
  let cellBelow = cellArray[num + rowLength];
  let startingClue = cellArray[num].down;

  // console.log('cell below', cellBelow) //wrapping if protects bottom row
  if (num + rowLength < cellArray.length) {
    if (cellBelow.answer && cellBelow.answer !== ".") {
      return num + rowLength;
    }
  }

  let clueStart;
  //else find index of first occurence for this clue
  //while the clues of the cells are the same and there is still board space to check
  for (let i = 1; i < rowLength; i++) {
    let currentAboveCell = cellArray[num - i * rowLength];
    if (num - i * rowLength < 0) {
      //you're at the top of the board
      clueStart = num - (i - 1) * rowLength;
      break;
    } else if (currentAboveCell.answer == ".") {
      //you've hit a black cell
      clueStart = num - (i - 1) * rowLength;
      break;
    } else {
      //you've hit another white cell that's part of current down clue
      continue;
    }
  }

  //from the top of the down clue, go to the right until you hit a cell with a blank above it or an index in the first row
  for (let i = clueStart; i < cellArray.length; i++) {
    //if the cell is in the first row and not a blank cell, return the next cell
    let currentCell = cellArray[i + 1];
    if (currentCell.index < rowLength && currentCell.answer !== ".") {
      return i + 1;
    }
    let aboveCell = cellArray[i + 1 - rowLength];
    if (aboveCell.answer == ".") {
      return i + 1;
    }
  }
}

// console.log('testing next down cell, from 0 (expect 15) : ', findNextDownCell(0, exGuesses))
// console.log('testing next down cell, from 16 (expect 31) : ', findNextDownCell(16, exGuesses))
// console.log('testing next down cell, from 75 (expect 1), 0 intermediary : ', findNextDownCell(75, exGuesses))
// console.log('testing next down cell, from 153 (expect 114), 108 intermediary : ', findNextDownCell(153, exGuesses))
// console.log('testing next down cell, from 215 (expect 146),  : ', findNextDownCell(215, exGuesses))

export function findPreviousDownCell(num, cellArray) {
  if (num == 0) return cellArray.length - 1;
  let rowLength = Math.sqrt(cellArray.length);

  //if there is an open cell above that's part of your word
  if (num - rowLength >= 0) {
    if (cellArray[num - rowLength].answer !== ".") {
      return num - rowLength;
    }
  }

  //else you (cell index n) are at the top of the board or the cell above you is a black cell,
  //go left until you find a cell at the top of the board or you find a cell with a black cell above it
  let startOfPreviousDownClue;

  for (let i = 1; i < cellArray.length; i++) {
    let currentCellIndex = num - i;
    let currentCell = cellArray[currentCellIndex];

    //if blank cell
    if (currentCell.answer == ".") {
      continue;
    }

    //if top row, return cell loc
    if (currentCellIndex - rowLength < 0) {
      startOfPreviousDownClue = num - i;
      break;
    }

    //if cell above is black cell return cell loc
    if (cellArray[currentCellIndex - rowLength].answer == ".") {
      startOfPreviousDownClue = num - i;
      break;
    }
  }
  let endOfPreviousDownClue;

  //now find the end of this down clue

  for (let j = 1; j < rowLength; j++) {
    let currentCellIndex = startOfPreviousDownClue + j * rowLength;
    let currentClue = cellArray[currentCellIndex];

    //if off board
    if (currentCellIndex > cellArray.length) {
      endOfPreviousClue = currentCellIndex - rowLength;
      break;
    }

    if (currentClue.answer == ".") {
      endOfPreviousClue = currentCellIndex - rowLength;
      break;
    }
  }

  return endOfPreviousClue;

  /*similar to next down cell, if above is available, go above
  if above is off the board or is a blank cell, then go left
  */
}

// function findNextDownClue(num, cellArray) {}

// function findPreviousDownClue(num, cellArray) {}

let exGuesses = [
  {
    answer: "A",
    guess: "",
    userId: 0,
    index: 0,
    number: 1,
    across: 'When Polonius says "Brevity is the soul of wit"',
    down: "Influence",
    color: "black"
  },
  {
    answer: "C",
    guess: "",
    userId: 0,
    index: 1,
    number: 2,
    across: 'When Polonius says "Brevity is the soul of wit"',
    down: "With 51-Down, late, beloved actress",
    color: "black"
  },
  {
    answer: "T",
    guess: "",
    userId: 0,
    index: 2,
    number: 3,
    across: 'When Polonius says "Brevity is the soul of wit"',
    down: "Certain marketing gimmicks",
    color: "black"
  },
  {
    answer: "I",
    guess: "",
    userId: 0,
    index: 3,
    number: 4,
    across: 'When Polonius says "Brevity is the soul of wit"',
    down: "Hell-bent (on)",
    color: "black"
  },
  {
    answer: "I",
    guess: "",
    userId: 0,
    index: 4,
    number: 5,
    across: 'When Polonius says "Brevity is the soul of wit"',
    down: '"___ a trap!"',
    color: "black"
  },
  { answer: ".", guess: ".", userId: 0, index: 5 },
  {
    answer: "B",
    guess: "",
    userId: 0,
    index: 6,
    number: 6,
    across: "Tusked beast",
    down: '"Harrumph!"',
    color: "black"
  },
  {
    answer: "O",
    guess: "",
    userId: 0,
    index: 7,
    number: 7,
    across: "Tusked beast",
    down: "Brand of artificial fat",
    color: "black"
  },
  {
    answer: "A",
    guess: "",
    userId: 0,
    index: 8,
    number: 8,
    across: "Tusked beast",
    down: "Deal with a broken teleprompter, say",
    color: "black"
  },
  {
    answer: "R",
    guess: "",
    userId: 0,
    index: 9,
    number: 9,
    across: "Tusked beast",
    down: "Rae Sremmurd, e.g.",
    color: "black"
  },
  { answer: ".", guess: ".", userId: 0, index: 10 },
  {
    answer: "I",
    guess: "",
    userId: 0,
    index: 11,
    number: 10,
    across: "Kind of threat",
    down: "Makeup of the planet Hoth",
    color: "black"
  },
  {
    answer: "D",
    guess: "",
    userId: 0,
    index: 12,
    number: 11,
    across: "Kind of threat",
    down: "Nosedive",
    color: "black"
  },
  {
    answer: "L",
    guess: "",
    userId: 0,
    index: 13,
    number: 12,
    across: "Kind of threat",
    down: "Squeak stopper",
    color: "black"
  },
  {
    answer: "E",
    guess: "",
    userId: 0,
    index: 14,
    number: 13,
    across: "Kind of threat",
    down: "Turnoff for drivers",
    color: "black"
  },
  {
    answer: "F",
    guess: "",
    userId: 0,
    index: 15,
    number: 14,
    across: "Swoon",
    down: "Influence",
    color: "black"
  },
  {
    answer: "A",
    guess: "",
    userId: 0,
    index: 16,
    number: 0,
    across: "Swoon",
    down: "With 51-Down, late, beloved actress",
    color: "black"
  },
  {
    answer: "I",
    guess: "",
    userId: 0,
    index: 17,
    number: 0,
    across: "Swoon",
    down: "Certain marketing gimmicks",
    color: "black"
  },
  {
    answer: "N",
    guess: "",
    userId: 0,
    index: 18,
    number: 0,
    across: "Swoon",
    down: "Hell-bent (on)",
    color: "black"
  },
  {
    answer: "T",
    guess: "",
    userId: 0,
    index: 19,
    number: 0,
    across: "Swoon",
    down: '"___ a trap!"',
    color: "black"
  },
  { answer: ".", guess: ".", userId: 0, index: 20 },
  {
    answer: "A",
    guess: "",
    userId: 0,
    index: 21,
    number: 15,
    across: "Alan who played Captain Pierce",
    down: '"Harrumph!"',
    color: "black"
  },
  {
    answer: "L",
    guess: "",
    userId: 0,
    index: 22,
    number: 0,
    across: "Alan who played Captain Pierce",
    down: "Brand of artificial fat",
    color: "black"
  },
  {
    answer: "D",
    guess: "",
    userId: 0,
    index: 23,
    number: 0,
    across: "Alan who played Captain Pierce",
    down: "Deal with a broken teleprompter, say",
    color: "black"
  },
  {
    answer: "A",
    guess: "",
    userId: 0,
    index: 24,
    number: 0,
    across: "Alan who played Captain Pierce",
    down: "Rae Sremmurd, e.g.",
    color: "black"
  },
  { answer: ".", guess: ".", userId: 0, index: 25 },
  {
    answer: "C",
    guess: "",
    userId: 0,
    index: 26,
    number: 16,
    across: "Essential point",
    down: "Makeup of the planet Hoth",
    color: "black"
  },
  {
    answer: "R",
    guess: "",
    userId: 0,
    index: 27,
    number: 0,
    across: "Essential point",
    down: "Nosedive",
    color: "black"
  },
  {
    answer: "U",
    guess: "",
    userId: 0,
    index: 28,
    number: 0,
    across: "Essential point",
    down: "Squeak stopper",
    color: "black"
  },
  {
    answer: "X",
    guess: "",
    userId: 0,
    index: 29,
    number: 0,
    across: "Essential point",
    down: "Turnoff for drivers",
    color: "black"
  },
  {
    answer: "F",
    guess: "",
    userId: 0,
    index: 30,
    number: 17,
    across: "Agonizes (over)",
    down: "Influence",
    color: "black"
  },
  {
    answer: "R",
    guess: "",
    userId: 0,
    index: 31,
    number: 0,
    across: "Agonizes (over)",
    down: "With 51-Down, late, beloved actress",
    color: "black"
  },
  {
    answer: "E",
    guess: "",
    userId: 0,
    index: 32,
    number: 0,
    across: "Agonizes (over)",
    down: "Certain marketing gimmicks",
    color: "black"
  },
  {
    answer: "T",
    guess: "",
    userId: 0,
    index: 33,
    number: 0,
    across: "Agonizes (over)",
    down: "Hell-bent (on)",
    color: "black"
  },
  {
    answer: "S",
    guess: "",
    userId: 0,
    index: 34,
    number: 0,
    across: "Agonizes (over)",
    down: '"___ a trap!"',
    color: "black"
  },
  { answer: ".", guess: ".", userId: 0, index: 35 },
  {
    answer: "H",
    guess: "",
    userId: 0,
    index: 36,
    number: 18,
    across:
      "With 61- and 37-Across, famous line by 53-Across in [see circled letters]",
    down: '"Harrumph!"',
    color: "black"
  },
  {
    answer: "E",
    guess: "",
    userId: 0,
    index: 37,
    number: 0,
    across:
      "With 61- and 37-Across, famous line by 53-Across in [see circled letters]",
    down: "Brand of artificial fat",
    color: "black"
  },
  {
    answer: "L",
    guess: "",
    userId: 0,
    index: 38,
    number: 0,
    across:
      "With 61- and 37-Across, famous line by 53-Across in [see circled letters]",
    down: "Deal with a broken teleprompter, say",
    color: "black"
  },
  {
    answer: "P",
    guess: "",
    userId: 0,
    index: 39,
    number: 0,
    across:
      "With 61- and 37-Across, famous line by 53-Across in [see circled letters]",
    down: "Rae Sremmurd, e.g.",
    color: "black"
  },
  {
    answer: "M",
    guess: "",
    userId: 0,
    index: 40,
    number: 19,
    across:
      "With 61- and 37-Across, famous line by 53-Across in [see circled letters]",
    down: '"Doctor Faustus" novelist Thomas',
    color: "black"
  },
  {
    answer: "E",
    guess: "",
    userId: 0,
    index: 41,
    number: 0,
    across:
      "With 61- and 37-Across, famous line by 53-Across in [see circled letters]",
    down: "Makeup of the planet Hoth",
    color: "black"
  },
  {
    answer: "O",
    guess: "",
    userId: 0,
    index: 42,
    number: 0,
    across:
      "With 61- and 37-Across, famous line by 53-Across in [see circled letters]",
    down: "Nosedive",
    color: "black"
  },
  {
    answer: "B",
    guess: "",
    userId: 0,
    index: 43,
    number: 0,
    across:
      "With 61- and 37-Across, famous line by 53-Across in [see circled letters]",
    down: "Squeak stopper",
    color: "black"
  },
  {
    answer: "I",
    guess: "",
    userId: 0,
    index: 44,
    number: 0,
    across:
      "With 61- and 37-Across, famous line by 53-Across in [see circled letters]",
    down: "Turnoff for drivers",
    color: "black"
  },
  {
    answer: "E",
    guess: "",
    userId: 0,
    index: 45,
    number: 20,
    across: 'The "E" in HOMES',
    down: "Influence",
    color: "black"
  },
  {
    answer: "R",
    guess: "",
    userId: 0,
    index: 46,
    number: 0,
    across: 'The "E" in HOMES',
    down: "With 51-Down, late, beloved actress",
    color: "black"
  },
  {
    answer: "I",
    guess: "",
    userId: 0,
    index: 47,
    number: 0,
    across: 'The "E" in HOMES',
    down: "Certain marketing gimmicks",
    color: "black"
  },
  {
    answer: "E",
    guess: "",
    userId: 0,
    index: 48,
    number: 0,
    across: 'The "E" in HOMES',
    down: "Hell-bent (on)",
    color: "black"
  },
  { answer: ".", guess: ".", userId: 0, index: 49 },
  { answer: ".", guess: ".", userId: 0, index: 50 },
  { answer: ".", guess: ".", userId: 0, index: 51 },
  {
    answer: "A",
    guess: "",
    userId: 0,
    index: 52,
    number: 21,
    across: "Nubian heroine of opera",
    down: "Brand of artificial fat",
    color: "black"
  },
  {
    answer: "I",
    guess: "",
    userId: 0,
    index: 53,
    number: 0,
    across: "Nubian heroine of opera",
    down: "Deal with a broken teleprompter, say",
    color: "black"
  },
  {
    answer: "D",
    guess: "",
    userId: 0,
    index: 54,
    number: 0,
    across: "Nubian heroine of opera",
    down: "Rae Sremmurd, e.g.",
    color: "black"
  },
  {
    answer: "A",
    guess: "",
    userId: 0,
    index: 55,
    number: 0,
    across: "Nubian heroine of opera",
    down: '"Doctor Faustus" novelist Thomas',
    color: "black"
  },
  { answer: ".", guess: ".", userId: 0, index: 56 },
  {
    answer: "P",
    guess: "",
    userId: 0,
    index: 57,
    number: 22,
    across: "Family member who was probably adopted",
    down: "Nosedive",
    color: "black"
  },
  {
    answer: "E",
    guess: "",
    userId: 0,
    index: 58,
    number: 0,
    across: "Family member who was probably adopted",
    down: "Squeak stopper",
    color: "black"
  },
  {
    answer: "T",
    guess: "",
    userId: 0,
    index: 59,
    number: 0,
    across: "Family member who was probably adopted",
    down: "Turnoff for drivers",
    color: "black"
  },
  {
    answer: "C",
    guess: "",
    userId: 0,
    index: 60,
    number: 23,
    across: "Hairstyle for 53-Across, colloquially",
    down: "Influence",
    color: "black"
  },
  {
    answer: "I",
    guess: "",
    userId: 0,
    index: 61,
    number: 0,
    across: "Hairstyle for 53-Across, colloquially",
    down: "With 51-Down, late, beloved actress",
    color: "black"
  },
  {
    answer: "N",
    guess: "",
    userId: 0,
    index: 62,
    number: 0,
    across: "Hairstyle for 53-Across, colloquially",
    down: "Certain marketing gimmicks",
    color: "black"
  },
  {
    answer: "N",
    guess: "",
    userId: 0,
    index: 63,
    number: 0,
    across: "Hairstyle for 53-Across, colloquially",
    down: "Hell-bent (on)",
    color: "black"
  },
  {
    answer: "A",
    guess: "",
    userId: 0,
    index: 64,
    number: 24,
    across: "Hairstyle for 53-Across, colloquially",
    down: "Mont Blanc, e.g., to locals",
    color: "black"
  },
  {
    answer: "M",
    guess: "",
    userId: 0,
    index: 65,
    number: 25,
    across: "Hairstyle for 53-Across, colloquially",
    down: "Cripple",
    color: "black"
  },
  {
    answer: "O",
    guess: "",
    userId: 0,
    index: 66,
    number: 26,
    across: "Hairstyle for 53-Across, colloquially",
    down: "Heeds",
    color: "black"
  },
  {
    answer: "N",
    guess: "",
    userId: 0,
    index: 67,
    number: 0,
    across: "Hairstyle for 53-Across, colloquially",
    down: "Brand of artificial fat",
    color: "black"
  },
  {
    answer: "B",
    guess: "",
    userId: 0,
    index: 68,
    number: 0,
    across: "Hairstyle for 53-Across, colloquially",
    down: "Deal with a broken teleprompter, say",
    color: "black"
  },
  {
    answer: "U",
    guess: "",
    userId: 0,
    index: 69,
    number: 0,
    across: "Hairstyle for 53-Across, colloquially",
    down: "Rae Sremmurd, e.g.",
    color: "black"
  },
  {
    answer: "N",
    guess: "",
    userId: 0,
    index: 70,
    number: 0,
    across: "Hairstyle for 53-Across, colloquially",
    down: '"Doctor Faustus" novelist Thomas',
    color: "black"
  },
  {
    answer: "S",
    guess: "",
    userId: 0,
    index: 71,
    number: 27,
    across: "Hairstyle for 53-Across, colloquially",
    down: "Merit badge displayer",
    color: "black"
  },
  { answer: ".", guess: ".", userId: 0, index: 72 },
  { answer: ".", guess: ".", userId: 0, index: 73 },
  { answer: ".", guess: ".", userId: 0, index: 74 },
  {
    answer: "T",
    guess: "",
    userId: 0,
    index: 75,
    number: 28,
    across: "Place where trials are conducted",
    down: "Influence",
    color: "black"
  },
  {
    answer: "E",
    guess: "",
    userId: 0,
    index: 76,
    number: 0,
    across: "Place where trials are conducted",
    down: "With 51-Down, late, beloved actress",
    color: "black"
  },
  {
    answer: "S",
    guess: "",
    userId: 0,
    index: 77,
    number: 0,
    across: "Place where trials are conducted",
    down: "Certain marketing gimmicks",
    color: "black"
  },
  {
    answer: "T",
    guess: "",
    userId: 0,
    index: 78,
    number: 0,
    across: "Place where trials are conducted",
    down: "Hell-bent (on)",
    color: "black"
  },
  {
    answer: "L",
    guess: "",
    userId: 0,
    index: 79,
    number: 0,
    across: "Place where trials are conducted",
    down: "Mont Blanc, e.g., to locals",
    color: "black"
  },
  {
    answer: "A",
    guess: "",
    userId: 0,
    index: 80,
    number: 0,
    across: "Place where trials are conducted",
    down: "Cripple",
    color: "black"
  },
  {
    answer: "B",
    guess: "",
    userId: 0,
    index: 81,
    number: 0,
    across: "Place where trials are conducted",
    down: "Heeds",
    color: "black"
  },
  { answer: ".", guess: ".", userId: 0, index: 82 },
  { answer: ".", guess: ".", userId: 0, index: 83 },
  {
    answer: "O",
    guess: "",
    userId: 0,
    index: 84,
    number: 29,
    across: "Hitting blackjack after blackjack, say",
    down: "Rae Sremmurd, e.g.",
    color: "black"
  },
  {
    answer: "N",
    guess: "",
    userId: 0,
    index: 85,
    number: 0,
    across: "Hitting blackjack after blackjack, say",
    down: '"Doctor Faustus" novelist Thomas',
    color: "black"
  },
  {
    answer: "A",
    guess: "",
    userId: 0,
    index: 86,
    number: 0,
    across: "Hitting blackjack after blackjack, say",
    down: "Merit badge displayer",
    color: "black"
  },
  {
    answer: "R",
    guess: "",
    userId: 0,
    index: 87,
    number: 30,
    across: "Hitting blackjack after blackjack, say",
    down: "Figure on an Aussie Xing sign, perhaps",
    color: "black"
  },
  {
    answer: "U",
    guess: "",
    userId: 0,
    index: 88,
    number: 31,
    across: "Hitting blackjack after blackjack, say",
    down: "World Series official",
    color: "black"
  },
  {
    answer: "N",
    guess: "",
    userId: 0,
    index: 89,
    number: 32,
    across: "Hitting blackjack after blackjack, say",
    down: "Formerly named",
    color: "black"
  },
  { answer: ".", guess: ".", userId: 0, index: 90 },
  { answer: ".", guess: ".", userId: 0, index: 91 },
  { answer: ".", guess: ".", userId: 0, index: 92 },
  { answer: ".", guess: ".", userId: 0, index: 93 },
  {
    answer: "P",
    guess: "",
    userId: 0,
    index: 94,
    number: 33,
    across: "Michelangelo masterpiece",
    down: "Mont Blanc, e.g., to locals",
    color: "black"
  },
  {
    answer: "I",
    guess: "F",
    userId: 1,
    index: 95,
    number: 0,
    across: "Michelangelo masterpiece",
    down: "Cripple",
    color: "black"
  },
  {
    answer: "E",
    guess: "",
    userId: 0,
    index: 96,
    number: 0,
    across: "Michelangelo masterpiece",
    down: "Heeds",
    color: "black"
  },
  {
    answer: "T",
    guess: "",
    userId: 0,
    index: 97,
    number: 34,
    across: "Michelangelo masterpiece",
    down: '"___ late!"',
    color: "black"
  },
  {
    answer: "A",
    guess: "",
    userId: 0,
    index: 98,
    number: 35,
    across: "Michelangelo masterpiece",
    down: "Tennis champ Agassi",
    color: "black"
  },
  { answer: ".", guess: ".", userId: 0, index: 99 },
  { answer: ".", guess: ".", userId: 0, index: 100 },
  {
    answer: "S",
    guess: "",
    userId: 0,
    index: 101,
    number: 36,
    across: "A few",
    down: "Merit badge displayer",
    color: "black"
  },
  {
    answer: "O",
    guess: "",
    userId: 0,
    index: 102,
    number: 0,
    across: "A few",
    down: "Figure on an Aussie Xing sign, perhaps",
    color: "black"
  },
  {
    answer: "M",
    guess: "",
    userId: 0,
    index: 103,
    number: 0,
    across: "A few",
    down: "World Series official",
    color: "black"
  },
  {
    answer: "E",
    guess: "",
    userId: 0,
    index: 104,
    number: 0,
    across: "A few",
    down: "Formerly named",
    color: "black"
  },
  {
    answer: "Y",
    guess: "",
    userId: 0,
    index: 105,
    number: 37,
    across: "See 18-Across",
    down: "Deviate during flight, as a rocket",
    color: "black"
  },
  {
    answer: "O",
    guess: "",
    userId: 0,
    index: 106,
    number: 38,
    across: "See 18-Across",
    down: "Non's opposite",
    color: "black"
  },
  {
    answer: "U",
    guess: "",
    userId: 0,
    index: 107,
    number: 39,
    across: "See 18-Across",
    down: "Coffee container",
    color: "black"
  },
  {
    answer: "R",
    guess: "",
    userId: 0,
    index: 108,
    number: 40,
    across: "See 18-Across",
    down: "Speak with a gravelly voice",
    color: "black"
  },
  {
    answer: "E",
    guess: "",
    userId: 0,
    index: 109,
    number: 0,
    across: "See 18-Across",
    down: "Mont Blanc, e.g., to locals",
    color: "black"
  },
  {
    answer: "M",
    guess: "E",
    userId: 1,
    index: 110,
    number: 0,
    across: "See 18-Across",
    down: "Cripple",
    color: "black"
  },
  {
    answer: "Y",
    guess: "T",
    userId: 1,
    index: 111,
    number: 0,
    across: "See 18-Across",
    down: "Heeds",
    color: "black"
  },
  {
    answer: "O",
    guess: "",
    userId: 0,
    index: 112,
    number: 0,
    across: "See 18-Across",
    down: '"___ late!"',
    color: "black"
  },
  {
    answer: "N",
    guess: "E",
    userId: 2,
    index: 113,
    number: 0,
    across: "See 18-Across",
    down: "Tennis champ Agassi",
    color: "black"
  },
  {
    answer: "L",
    guess: "",
    userId: 0,
    index: 114,
    number: 41,
    across: "See 18-Across",
    down: 'Amy Adams\'s "Man of Steel" role',
    color: "black"
  },
  {
    answer: "Y",
    guess: "",
    userId: 0,
    index: 115,
    number: 42,
    across: "See 18-Across",
    down: "Puppy sounds",
    color: "black"
  },
  {
    answer: "H",
    guess: "",
    userId: 0,
    index: 116,
    number: 0,
    across: "See 18-Across",
    down: "Merit badge displayer",
    color: "black"
  },
  {
    answer: "O",
    guess: "",
    userId: 0,
    index: 117,
    number: 0,
    across: "See 18-Across",
    down: "Figure on an Aussie Xing sign, perhaps",
    color: "black"
  },
  {
    answer: "P",
    guess: "",
    userId: 0,
    index: 118,
    number: 0,
    across: "See 18-Across",
    down: "World Series official",
    color: "black"
  },
  {
    answer: "E",
    guess: "",
    userId: 0,
    index: 119,
    number: 0,
    across: "See 18-Across",
    down: "Formerly named",
    color: "black"
  },
  {
    answer: "A",
    guess: "",
    userId: 0,
    index: 120,
    number: 43,
    across: "Ambience",
    down: "Deviate during flight, as a rocket",
    color: "black"
  },
  {
    answer: "U",
    guess: "",
    userId: 0,
    index: 121,
    number: 0,
    across: "Ambience",
    down: "Non's opposite",
    color: "black"
  },
  {
    answer: "R",
    guess: "",
    userId: 0,
    index: 122,
    number: 0,
    across: "Ambience",
    down: "Coffee container",
    color: "black"
  },
  {
    answer: "A",
    guess: "",
    userId: 0,
    index: 123,
    number: 0,
    across: "Ambience",
    down: "Speak with a gravelly voice",
    color: "black"
  },
  { answer: ".", guess: ".", userId: 0, index: 124 },
  { answer: ".", guess: ".", userId: 0, index: 125 },
  {
    answer: "S",
    guess: "",
    userId: 0,
    index: 126,
    number: 44,
    across: '"Same here!"',
    down: "Heeds",
    color: "black"
  },
  {
    answer: "O",
    guess: "",
    userId: 0,
    index: 127,
    number: 0,
    across: '"Same here!"',
    down: '"___ late!"',
    color: "black"
  },
  {
    answer: "D",
    guess: "",
    userId: 0,
    index: 128,
    number: 0,
    across: '"Same here!"',
    down: "Tennis champ Agassi",
    color: "black"
  },
  {
    answer: "O",
    guess: "",
    userId: 0,
    index: 129,
    number: 0,
    across: '"Same here!"',
    down: 'Amy Adams\'s "Man of Steel" role',
    color: "black"
  },
  {
    answer: "I",
    guess: "",
    userId: 0,
    index: 130,
    number: 0,
    across: '"Same here!"',
    down: "Puppy sounds",
    color: "black"
  },
  { answer: ".", guess: ".", userId: 0, index: 131 },
  { answer: ".", guess: ".", userId: 0, index: 132 },
  { answer: ".", guess: ".", userId: 0, index: 133 },
  { answer: ".", guess: ".", userId: 0, index: 134 },
  {
    answer: "W",
    guess: "",
    userId: 0,
    index: 135,
    number: 45,
    across: "Is victorious in",
    down: "Deviate during flight, as a rocket",
    color: "black"
  },
  {
    answer: "I",
    guess: "",
    userId: 0,
    index: 136,
    number: 0,
    across: "Is victorious in",
    down: "Non's opposite",
    color: "black"
  },
  {
    answer: "N",
    guess: "",
    userId: 0,
    index: 137,
    number: 0,
    across: "Is victorious in",
    down: "Coffee container",
    color: "black"
  },
  {
    answer: "S",
    guess: "",
    userId: 0,
    index: 138,
    number: 0,
    across: "Is victorious in",
    down: "Speak with a gravelly voice",
    color: "black"
  },
  {
    answer: "A",
    guess: "",
    userId: 0,
    index: 139,
    number: 46,
    across: "Is victorious in",
    down: "British derriÃ¨re",
    color: "black"
  },
  {
    answer: "T",
    guess: "",
    userId: 0,
    index: 140,
    number: 47,
    across: "Is victorious in",
    down: "So far, informally",
    color: "black"
  },
  { answer: ".", guess: ".", userId: 0, index: 141 },
  { answer: ".", guess: ".", userId: 0, index: 142 },
  {
    answer: "R",
    guess: "",
    userId: 0,
    index: 143,
    number: 48,
    across: "Swindles",
    down: "Tennis champ Agassi",
    color: "black"
  },
  {
    answer: "I",
    guess: "",
    userId: 0,
    index: 144,
    number: 0,
    across: "Swindles",
    down: 'Amy Adams\'s "Man of Steel" role',
    color: "black"
  },
  {
    answer: "P",
    guess: "",
    userId: 0,
    index: 145,
    number: 0,
    across: "Swindles",
    down: "Puppy sounds",
    color: "black"
  },
  {
    answer: "O",
    guess: "",
    userId: 0,
    index: 146,
    number: 49,
    across: "Swindles",
    down: "Chant after a fÃºtbol goal",
    color: "black"
  },
  {
    answer: "F",
    guess: "",
    userId: 0,
    index: 147,
    number: 50,
    across: "Swindles",
    down: "In fine ___ (healthy)",
    color: "black"
  },
  {
    answer: "F",
    guess: "",
    userId: 0,
    index: 148,
    number: 51,
    across: "Swindles",
    down: "See 2-Down",
    color: "black"
  },
  {
    answer: "S",
    guess: "",
    userId: 0,
    index: 149,
    number: 52,
    across: "Swindles",
    down: "Agree to a proposal",
    color: "black"
  },
  { answer: ".", guess: ".", userId: 0, index: 150 },
  { answer: ".", guess: ".", userId: 0, index: 151 },
  { answer: ".", guess: ".", userId: 0, index: 152 },
  {
    answer: "P",
    guess: "",
    userId: 0,
    index: 153,
    number: 53,
    across: "Iconic role for 2-/51-Down",
    down: "Speak with a gravelly voice",
    color: "black"
  },
  {
    answer: "R",
    guess: "",
    userId: 0,
    index: 154,
    number: 0,
    across: "Iconic role for 2-/51-Down",
    down: "British derriÃ¨re",
    color: "black"
  },
  {
    answer: "I",
    guess: "",
    userId: 0,
    index: 155,
    number: 0,
    across: "Iconic role for 2-/51-Down",
    down: "So far, informally",
    color: "black"
  },
  {
    answer: "N",
    guess: "",
    userId: 0,
    index: 156,
    number: 54,
    across: "Iconic role for 2-/51-Down",
    down: "Country singer Judd",
    color: "black"
  },
  {
    answer: "C",
    guess: "",
    userId: 0,
    index: 157,
    number: 55,
    across: "Iconic role for 2-/51-Down",
    down: "Modern lead-in to space or security",
    color: "black"
  },
  {
    answer: "E",
    guess: "",
    userId: 0,
    index: 158,
    number: 0,
    across: "Iconic role for 2-/51-Down",
    down: "Tennis champ Agassi",
    color: "black"
  },
  {
    answer: "S",
    guess: "",
    userId: 0,
    index: 159,
    number: 0,
    across: "Iconic role for 2-/51-Down",
    down: 'Amy Adams\'s "Man of Steel" role',
    color: "black"
  },
  {
    answer: "S",
    guess: "",
    userId: 0,
    index: 160,
    number: 0,
    across: "Iconic role for 2-/51-Down",
    down: "Puppy sounds",
    color: "black"
  },
  {
    answer: "L",
    guess: "",
    userId: 0,
    index: 161,
    number: 0,
    across: "Iconic role for 2-/51-Down",
    down: "Chant after a fÃºtbol goal",
    color: "black"
  },
  {
    answer: "E",
    guess: "",
    userId: 0,
    index: 162,
    number: 0,
    across: "Iconic role for 2-/51-Down",
    down: "In fine ___ (healthy)",
    color: "black"
  },
  {
    answer: "I",
    guess: "",
    userId: 0,
    index: 163,
    number: 0,
    across: "Iconic role for 2-/51-Down",
    down: "See 2-Down",
    color: "black"
  },
  {
    answer: "A",
    guess: "",
    userId: 0,
    index: 164,
    number: 0,
    across: "Iconic role for 2-/51-Down",
    down: "Agree to a proposal",
    color: "black"
  },
  {
    answer: "O",
    guess: "",
    userId: 0,
    index: 165,
    number: 56,
    across: '"What have we here?!"',
    down: "Real head-turners?",
    color: "black"
  },
  {
    answer: "H",
    guess: "",
    userId: 0,
    index: 166,
    number: 57,
    across: '"What have we here?!"',
    down: "Drag",
    color: "black"
  },
  {
    answer: "O",
    guess: "",
    userId: 0,
    index: 167,
    number: 58,
    across: '"What have we here?!"',
    down: "Not deceived by",
    color: "black"
  },
  { answer: ".", guess: ".", userId: 0, index: 168 },
  {
    answer: "S",
    guess: "",
    userId: 0,
    index: 169,
    number: 59,
    across: "Knock 'em dead",
    down: "British derriÃ¨re",
    color: "black"
  },
  {
    answer: "L",
    guess: "",
    userId: 0,
    index: 170,
    number: 0,
    across: "Knock 'em dead",
    down: "So far, informally",
    color: "black"
  },
  {
    answer: "A",
    guess: "",
    userId: 0,
    index: 171,
    number: 0,
    across: "Knock 'em dead",
    down: "Country singer Judd",
    color: "black"
  },
  {
    answer: "Y",
    guess: "",
    userId: 0,
    index: 172,
    number: 0,
    across: "Knock 'em dead",
    down: "Modern lead-in to space or security",
    color: "black"
  },
  { answer: ".", guess: ".", userId: 0, index: 173 },
  { answer: ".", guess: ".", userId: 0, index: 174 },
  { answer: ".", guess: ".", userId: 0, index: 175 },
  {
    answer: "E",
    guess: "",
    userId: 0,
    index: 176,
    number: 60,
    across: "Online crafts seller",
    down: "Chant after a fÃºtbol goal",
    color: "black"
  },
  {
    answer: "T",
    guess: "",
    userId: 0,
    index: 177,
    number: 0,
    across: "Online crafts seller",
    down: "In fine ___ (healthy)",
    color: "black"
  },
  {
    answer: "S",
    guess: "",
    userId: 0,
    index: 178,
    number: 0,
    across: "Online crafts seller",
    down: "See 2-Down",
    color: "black"
  },
  {
    answer: "Y",
    guess: "",
    userId: 0,
    index: 179,
    number: 0,
    across: "Online crafts seller",
    down: "Agree to a proposal",
    color: "black"
  },
  {
    answer: "W",
    guess: "",
    userId: 0,
    index: 180,
    number: 61,
    across: "See 18-Across",
    down: "Real head-turners?",
    color: "black"
  },
  {
    answer: "A",
    guess: "",
    userId: 0,
    index: 181,
    number: 0,
    across: "See 18-Across",
    down: "Drag",
    color: "black"
  },
  {
    answer: "N",
    guess: "",
    userId: 0,
    index: 182,
    number: 0,
    across: "See 18-Across",
    down: "Not deceived by",
    color: "black"
  },
  {
    answer: "K",
    guess: "",
    userId: 0,
    index: 183,
    number: 62,
    across: "See 18-Across",
    down: "Beer barrel",
    color: "black"
  },
  {
    answer: "E",
    guess: "",
    userId: 0,
    index: 184,
    number: 0,
    across: "See 18-Across",
    down: "British derriÃ¨re",
    color: "black"
  },
  {
    answer: "N",
    guess: "",
    userId: 0,
    index: 185,
    number: 0,
    across: "See 18-Across",
    down: "So far, informally",
    color: "black"
  },
  {
    answer: "O",
    guess: "",
    userId: 0,
    index: 186,
    number: 0,
    across: "See 18-Across",
    down: "Country singer Judd",
    color: "black"
  },
  {
    answer: "B",
    guess: "",
    userId: 0,
    index: 187,
    number: 0,
    across: "See 18-Across",
    down: "Modern lead-in to space or security",
    color: "black"
  },
  {
    answer: "I",
    guess: "",
    userId: 0,
    index: 188,
    number: 63,
    across: "See 18-Across",
    down: "Having four sharps",
    color: "black"
  },
  { answer: ".", guess: ".", userId: 0, index: 189 },
  {
    answer: "M",
    guess: "",
    userId: 0,
    index: 190,
    number: 64,
    across: "Like old, neglected sweaters, maybe",
    down: 'Reference in "Treasure Island"',
    color: "black"
  },
  {
    answer: "O",
    guess: "",
    userId: 0,
    index: 191,
    number: 0,
    across: "Like old, neglected sweaters, maybe",
    down: "Chant after a fÃºtbol goal",
    color: "black"
  },
  {
    answer: "T",
    guess: "",
    userId: 0,
    index: 192,
    number: 0,
    across: "Like old, neglected sweaters, maybe",
    down: "In fine ___ (healthy)",
    color: "black"
  },
  {
    answer: "H",
    guess: "",
    userId: 0,
    index: 193,
    number: 0,
    across: "Like old, neglected sweaters, maybe",
    down: "See 2-Down",
    color: "black"
  },
  {
    answer: "Y",
    guess: "",
    userId: 0,
    index: 194,
    number: 0,
    across: "Like old, neglected sweaters, maybe",
    down: "Agree to a proposal",
    color: "black"
  },
  {
    answer: "L",
    guess: "",
    userId: 0,
    index: 195,
    number: 65,
    across: "Renaissance Faire instrument",
    down: "Real head-turners?",
    color: "black"
  },
  {
    answer: "U",
    guess: "",
    userId: 0,
    index: 196,
    number: 0,
    across: "Renaissance Faire instrument",
    down: "Drag",
    color: "black"
  },
  {
    answer: "T",
    guess: "",
    userId: 0,
    index: 197,
    number: 0,
    across: "Renaissance Faire instrument",
    down: "Not deceived by",
    color: "black"
  },
  {
    answer: "E",
    guess: "",
    userId: 0,
    index: 198,
    number: 0,
    across: "Renaissance Faire instrument",
    down: "Beer barrel",
    color: "black"
  },
  { answer: ".", guess: ".", userId: 0, index: 199 },
  {
    answer: "O",
    guess: "",
    userId: 0,
    index: 200,
    number: 66,
    across: "Sign of things to come",
    down: "So far, informally",
    color: "black"
  },
  {
    answer: "M",
    guess: "",
    userId: 0,
    index: 201,
    number: 0,
    across: "Sign of things to come",
    down: "Country singer Judd",
    color: "black"
  },
  {
    answer: "E",
    guess: "",
    userId: 0,
    index: 202,
    number: 0,
    across: "Sign of things to come",
    down: "Modern lead-in to space or security",
    color: "black"
  },
  {
    answer: "N",
    guess: "",
    userId: 0,
    index: 203,
    number: 0,
    across: "Sign of things to come",
    down: "Having four sharps",
    color: "black"
  },
  { answer: ".", guess: ".", userId: 0, index: 204 },
  {
    answer: "A",
    guess: "",
    userId: 0,
    index: 205,
    number: 67,
    across: "Tree-lined walkway, in France",
    down: 'Reference in "Treasure Island"',
    color: "black"
  },
  {
    answer: "L",
    guess: "",
    userId: 0,
    index: 206,
    number: 0,
    across: "Tree-lined walkway, in France",
    down: "Chant after a fÃºtbol goal",
    color: "black"
  },
  {
    answer: "L",
    guess: "",
    userId: 0,
    index: 207,
    number: 0,
    across: "Tree-lined walkway, in France",
    down: "In fine ___ (healthy)",
    color: "black"
  },
  {
    answer: "E",
    guess: "",
    userId: 0,
    index: 208,
    number: 0,
    across: "Tree-lined walkway, in France",
    down: "See 2-Down",
    color: "black"
  },
  {
    answer: "E",
    guess: "",
    userId: 0,
    index: 209,
    number: 0,
    across: "Tree-lined walkway, in France",
    down: "Agree to a proposal",
    color: "black"
  },
  {
    answer: "S",
    guess: "",
    userId: 0,
    index: 210,
    number: 68,
    across: "Make slo-o-o-ow progress",
    down: "Real head-turners?",
    color: "black"
  },
  {
    answer: "L",
    guess: "",
    userId: 0,
    index: 211,
    number: 0,
    across: "Make slo-o-o-ow progress",
    down: "Drag",
    color: "black"
  },
  {
    answer: "O",
    guess: "",
    userId: 0,
    index: 212,
    number: 0,
    across: "Make slo-o-o-ow progress",
    down: "Not deceived by",
    color: "black"
  },
  {
    answer: "G",
    guess: "",
    userId: 0,
    index: 213,
    number: 0,
    across: "Make slo-o-o-ow progress",
    down: "Beer barrel",
    color: "black"
  },
  { answer: ".", guess: ".", userId: 0, index: 214 },
  {
    answer: "W",
    guess: "",
    userId: 0,
    index: 215,
    number: 69,
    across: "Concealed mike",
    down: "So far, informally",
    color: "black"
  },
  {
    answer: "I",
    guess: "",
    userId: 0,
    index: 216,
    number: 0,
    across: "Concealed mike",
    down: "Country singer Judd",
    color: "black"
  },
  {
    answer: "R",
    guess: "",
    userId: 0,
    index: 217,
    number: 0,
    across: "Concealed mike",
    down: "Modern lead-in to space or security",
    color: "black"
  },
  {
    answer: "E",
    guess: "",
    userId: 0,
    index: 218,
    number: 0,
    across: "Concealed mike",
    down: "Having four sharps",
    color: "black"
  },
  { answer: ".", guess: ".", userId: 0, index: 219 },
  {
    answer: "P",
    guess: "",
    userId: 0,
    index: 220,
    number: 70,
    across: "Entitled sorts?",
    down: 'Reference in "Treasure Island"',
    color: "black"
  },
  {
    answer: "E",
    guess: "",
    userId: 0,
    index: 221,
    number: 0,
    across: "Entitled sorts?",
    down: "Chant after a fÃºtbol goal",
    color: "black"
  },
  {
    answer: "E",
    guess: "",
    userId: 0,
    index: 222,
    number: 0,
    across: "Entitled sorts?",
    down: "In fine ___ (healthy)",
    color: "black"
  },
  {
    answer: "R",
    guess: "",
    userId: 0,
    index: 223,
    number: 0,
    across: "Entitled sorts?",
    down: "See 2-Down",
    color: "black"
  },
  {
    answer: "S",
    guess: "",
    userId: 0,
    index: 224,
    number: 0,
    across: "Entitled sorts?",
    down: "Agree to a proposal",
    color: "black"
  }
];

// console.log(
//   "[SKIPS BLANKS] find next across clue start from 84 (expect 94): ",
//   findNextAcrossClue(84, exGuesses)
// );

// console.log(
//   "[WRAPS TABLE] find next across clue start from 222 (expect 0): ",
//   findNextAcrossClue(222, exGuesses)
// );

// console.log(
//   "[WORKS IN ROW] find next across clue start from 2 (expect 6): ",
//   findNextAcrossClue(2, exGuesses)
// );

// console.log(
//   "[WORKS ACROSS ROWS] find next across clue start from 27 (expect 30): ",
//   findNextAcrossClue(27, exGuesses)
// );

// console.log(
//   "[WORKS ACROSS ROWS/BLANKS] find next across clue start from 146 (expect 153): ",
//   findNextAcrossClue(146, exGuesses)
// );

// console.log('[BASIC] find previous across clue start from 39 (expect 36): ', findPreviousAcrossClue(37, exGuesses))

// console.log('[ROW START] find previous across clue start from 66 (expect 60): ', findPreviousAcrossClue(66, exGuesses))

console.log(
  "[BASIC] find previous across clue end from 96 (expect 84): ",
  findPreviousAcrossClue(96, exGuesses)
);

console.log(
  "[BASIC] find previous across clue end from 84 (expect 75): ",
  findPreviousAcrossClue(84, exGuesses)
);

// console.log('[ROW START] find previous across clue end from 66 (expect 60): ', findPreviousAcrossClue(66, exGuesses))
