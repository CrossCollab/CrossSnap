const makeGameInstance = data => {
  let acrossObj = {};
  data.crosswordObjectString.clues.across.forEach((clue, index) => {
    let clueNumber = clue.split(". ")[0];
    let cluePhrase = clue.split(". ")[1];
    acrossObj[clueNumber] = cluePhrase;
  });
  let downObj = {};
  data.crosswordObjectString.clues.down.forEach((clue, index) => {
    let clueNumber = clue.split(". ")[0];
    let cluePhrase = clue.split(". ")[1];
    downObj[clueNumber] = cluePhrase;
  });
  let guessArray = data.crosswordObjectString.grid.map((answer, index) => {
    if (answer === ".") {
      return (guessObj = {
        answer: answer,
        guess: ".",
        userId: 0,
        index
      });
    }
    const findAcross = index => {
      const clueNumber = data.crosswordObjectString.gridnums[index];
      if (data.crosswordObjectString.grid[index] === ".") {
        return undefined;
      } else if (clueNumber) {
        if (!acrossObj[`${clueNumber}`]) {
          const lowerNumber = index - 1;
          return findAcross(lowerNumber);
        } else {
          return acrossObj[`${clueNumber}`];
        }
      } else {
        const lowerNumber = index - 1;
        return findAcross(lowerNumber);
      }
    };
    const tableLength = Math.sqrt(data.crosswordObjectString.gridnums.length);
    const findDown = index => {
      const clueNumber = data.crosswordObjectString.gridnums[index];
      if (data.crosswordObjectString.grid[index] === ".") {
        return undefined;
      } else if (clueNumber) {
        if (!downObj[`${clueNumber}`]) {
          const lowerNumber = index - tableLength;
          return findDown(lowerNumber);
        } else {
          return downObj[`${clueNumber}`];
        }
      } else {
        const lowerNumber = index - tableLength;
        return findDown(lowerNumber);
      }
    };
    return {
      answer: answer,
      guess: "",
      userId: 0,
      index,
      number: data.crosswordObjectString.gridnums[index],
      across: findAcross(index),
      down: findDown(index),
      color: "black"
    };
  });
  let newGameInstance = {
    crosswordId: data.id,
    status: "incomplete",
    answers: data.crosswordObjectString.grid,
    numbers: data.crosswordObjectString.gridnums,
    across: data.crosswordObjectString.clues.across,
    down: data.crosswordObjectString.clues.down,
    guesses: guessArray
  };

  return newGameInstance;
};

module.exports = makeGameInstance;
