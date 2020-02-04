const Sequelize = require("sequelize");
const db = require("../db");
const Crossword = require("../models/crossword");

const GameInstance = db.define("gameInstance", {
  guesses: {
    type: Sequelize.JSON
  },
  answers: {
    type: Sequelize.JSON
  },
  status: {
    type: Sequelize.ENUM("incomplete", "filled", "correct")
  },
  numbers: {
    type: Sequelize.ARRAY(Sequelize.INTEGER)
  },
  across: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  },
  down: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  }
});

GameInstance.addHook("beforeValidate", (gameInstance, options) => {
  let acrossObj = {};
  gameInstance.across.forEach((clue, index) => {
    let clueNumber = clue.split(". ")[0];
    let cluePhrase = clue.split(". ")[1];
    acrossObj[clueNumber] = cluePhrase;
  });
  let downObj = {};
  gameInstance.down.forEach((clue, index) => {
    let clueNumber = clue.split(". ")[0];
    let cluePhrase = clue.split(". ")[1];
    downObj[clueNumber] = cluePhrase;
  });

  let guessArray = gameInstance.answers.map((answer, index) => {
    if (answer === ".") {
      return (guessObj = {
        answer: answer,
        guess: ".",
        userId: 0,
        index
      });
    }

    const findAcross = index => {
      const clueNumber = gameInstance.numbers[index];
      if (gameInstance.answers[index] === ".") {
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
    const tableLength = Math.sqrt(gameInstance.numbers.length);
    const findDown = index => {
      const clueNumber = gameInstance.numbers[index];
      if (gameInstance.answers[index] === ".") {
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
    return (guessObj = {
      answer: answer,
      guess: "",
      userId: 0,
      index,
      number: gameInstance.numbers[index],
      across: findAcross(index),
      down: findDown(index)
    });
  });

  gameInstance.guesses = guessArray;
});

module.exports = GameInstance;

//let guessArray = [{guess: "", userId: 3}, {guess: "B", userId: 4}]
//let answers = ['a', 'b', '.', 'c', 'd']
//[b,e,a,r,.,e,a,r,.]

// <td id=index innertext = guessArray[index].guess colorstyling=guess

//let answers = Crossword.grid

/*



["L","O","P","S",".","C","O","C","O",".",".","T","O","B","E","I","V","A","N",".","O","C","H","R","E",".","A","R","I","A","R","E","S","O","L","U","T","I","O","N",".","G","A","N","T","A","N","S","W","E","R","E","D",".","T","R","E","N","D","S",".",".",".","F","A","S","T",".","B","R","I","N","G",".",".","A","R","C","A","D","E",".","G","R","A","N","D","E","S","T","N","O","E","L","S",".","D","O","I","N","G",".","B","E","E","T","O","L","L",".","M","O","R","E","T",".","T","O","W","N","E","N","E",".","O","A","T","E","R",".","M","O","W","E","D","D","E","B","A","R","K","E","D",".","G","U","I","L","D","S",".",".","R","U","L","E","D",".","C","A","R","L",".",".",".","T","E","A","S","E","T",".","D","E","B","A","S","I","N","G","O","R","T","S",".","H","O","R","N","B","L","O","W","E","R","A","M","O","I",".","E","R","A","S","E",".","M","I","R","E","D","A","R","E",".",".","E","Y","E","D",".","E","N","O","S"]




[{"answer":"L","guess":"","userId":0},
{"answer":"O","guess":"","userId":0},
{"answer":"P","guess":"","userId":0},
{"answer":"S","guess":"","userId":0},
{"answer":".","guess":".","userId":0},
{"answer":"C","guess":"","userId":0},
{"answer":"O","guess":"","userId":0},
{"answer":"C","guess":"","userId":0},{"answer":"O","guess":"","userId":0},{"answer":".","guess":".","userId":0},{"answer":".","guess":".","userId":0},{"answer":"T","guess":"","userId":0},{"answer":"O","guess":"","userId":0},{"answer":"B","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":"I","guess":"","userId":0},{"answer":"V","guess":"","userId":0},{"answer":"A","guess":"","userId":0},{"answer":"N","guess":"","userId":0},{"answer":".","guess":".","userId":0},{"answer":"O","guess":"","userId":0},{"answer":"C","guess":"","userId":0},{"answer":"H","guess":"","userId":0},{"answer":"R","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":".","guess":".","userId":0},{"answer":"A","guess":"","userId":0},{"answer":"R","guess":"","userId":0},{"answer":"I","guess":"","userId":0},{"answer":"A","guess":"","userId":0},{"answer":"R","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":"S","guess":"","userId":0},{"answer":"O","guess":"","userId":0},{"answer":"L","guess":"","userId":0},{"answer":"U","guess":"","userId":0},{"answer":"T","guess":"","userId":0},{"answer":"I","guess":"","userId":0},{"answer":"O","guess":"","userId":0},{"answer":"N","guess":"","userId":0},{"answer":".","guess":".","userId":0},{"answer":"G","guess":"","userId":0},{"answer":"A","guess":"","userId":0},{"answer":"N","guess":"","userId":0},{"answer":"T","guess":"","userId":0},{"answer":"A","guess":"","userId":0},{"answer":"N","guess":"","userId":0},{"answer":"S","guess":"","userId":0},{"answer":"W","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":"R","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":"D","guess":"","userId":0},{"answer":".","guess":".","userId":0},{"answer":"T","guess":"","userId":0},{"answer":"R","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":"N","guess":"","userId":0},{"answer":"D","guess":"","userId":0},{"answer":"S","guess":"","userId":0},{"answer":".","guess":".","userId":0},{"answer":".","guess":".","userId":0},{"answer":".","guess":".","userId":0},{"answer":"F","guess":"","userId":0},{"answer":"A","guess":"","userId":0},{"answer":"S","guess":"","userId":0},{"answer":"T","guess":"","userId":0},{"answer":".","guess":".","userId":0},{"answer":"B","guess":"","userId":0},{"answer":"R","guess":"","userId":0},{"answer":"I","guess":"","userId":0},{"answer":"N","guess":"","userId":0},{"answer":"G","guess":"","userId":0},{"answer":".","guess":".","userId":0},{"answer":".","guess":".","userId":0},{"answer":"A","guess":"","userId":0},{"answer":"R","guess":"","userId":0},{"answer":"C","guess":"","userId":0},{"answer":"A","guess":"","userId":0},{"answer":"D","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":".","guess":".","userId":0},{"answer":"G","guess":"","userId":0},{"answer":"R","guess":"","userId":0},{"answer":"A","guess":"","userId":0},{"answer":"N","guess":"","userId":0},{"answer":"D","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":"S","guess":"","userId":0},{"answer":"T","guess":"","userId":0},{"answer":"N","guess":"","userId":0},{"answer":"O","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":"L","guess":"","userId":0},{"answer":"S","guess":"","userId":0},{"answer":".","guess":".","userId":0},{"answer":"D","guess":"","userId":0},{"answer":"O","guess":"","userId":0},{"answer":"I","guess":"","userId":0},{"answer":"N","guess":"","userId":0},{"answer":"G","guess":"","userId":0},{"answer":".","guess":".","userId":0},{"answer":"B","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":"T","guess":"","userId":0},{"answer":"O","guess":"","userId":0},{"answer":"L","guess":"","userId":0},{"answer":"L","guess":"","userId":0},{"answer":".","guess":".","userId":0},{"answer":"M","guess":"","userId":0},{"answer":"O","guess":"","userId":0},{"answer":"R","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":"T","guess":"","userId":0},{"answer":".","guess":".","userId":0},{"answer":"T","guess":"","userId":0},{"answer":"O","guess":"","userId":0},{"answer":"W","guess":"","userId":0},{"answer":"N","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":"N","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":".","guess":".","userId":0},{"answer":"O","guess":"","userId":0},{"answer":"A","guess":"","userId":0},{"answer":"T","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":"R","guess":"","userId":0},{"answer":".","guess":".","userId":0},{"answer":"M","guess":"","userId":0},{"answer":"O","guess":"","userId":0},{"answer":"W","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":"D","guess":"","userId":0},{"answer":"D","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":"B","guess":"","userId":0},{"answer":"A","guess":"","userId":0},{"answer":"R","guess":"","userId":0},{"answer":"K","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":"D","guess":"","userId":0},{"answer":".","guess":".","userId":0},{"answer":"G","guess":"","userId":0},{"answer":"U","guess":"","userId":0},{"answer":"I","guess":"","userId":0},{"answer":"L","guess":"","userId":0},{"answer":"D","guess":"","userId":0},{"answer":"S","guess":"","userId":0},{"answer":".","guess":".","userId":0},{"answer":".","guess":".","userId":0},{"answer":"R","guess":"","userId":0},{"answer":"U","guess":"","userId":0},{"answer":"L","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":"D","guess":"","userId":0},{"answer":".","guess":".","userId":0},{"answer":"C","guess":"","userId":0},{"answer":"A","guess":"","userId":0},{"answer":"R","guess":"","userId":0},{"answer":"L","guess":"","userId":0},{"answer":".","guess":".","userId":0},{"answer":".","guess":".","userId":0},{"answer":".","guess":".","userId":0},{"answer":"T","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":"A","guess":"","userId":0},{"answer":"S","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":"T","guess":"","userId":0},{"answer":".","guess":".","userId":0},{"answer":"D","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":"B","guess":"","userId":0},{"answer":"A","guess":"","userId":0},{"answer":"S","guess":"","userId":0},{"answer":"I","guess":"","userId":0},{"answer":"N","guess":"","userId":0},{"answer":"G","guess":"","userId":0},{"answer":"O","guess":"","userId":0},{"answer":"R","guess":"","userId":0},{"answer":"T","guess":"","userId":0},{"answer":"S","guess":"","userId":0},{"answer":".","guess":".","userId":0},{"answer":"H","guess":"","userId":0},{"answer":"O","guess":"","userId":0},{"answer":"R","guess":"","userId":0},{"answer":"N","guess":"","userId":0},{"answer":"B","guess":"","userId":0},{"answer":"L","guess":"","userId":0},{"answer":"O","guess":"","userId":0},{"answer":"W","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":"R","guess":"","userId":0},{"answer":"A","guess":"","userId":0},{"answer":"M","guess":"","userId":0},{"answer":"O","guess":"","userId":0},{"answer":"I","guess":"","userId":0},{"answer":".","guess":".","userId":0},{"answer":"E","guess":"","userId":0},{"answer":"R","guess":"","userId":0},{"answer":"A","guess":"","userId":0},{"answer":"S","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":".","guess":".","userId":0},{"answer":"M","guess":"","userId":0},{"answer":"I","guess":"","userId":0},{"answer":"R","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":"D","guess":"","userId":0},{"answer":"A","guess":"","userId":0},{"answer":"R","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":".","guess":".","userId":0},{"answer":".","guess":".","userId":0},{"answer":"E","guess":"","userId":0},{"answer":"Y","guess":"","userId":0},{"answer":"E","guess":"","userId":0},{"answer":"D","guess":"","userId":0},{"answer":".","guess":".","userId":0},{"answer":"E","guess":"","userId":0},{"answer":"N","guess":"","userId":0},{"answer":"O","guess":"","userId":0},{"answer":"S","guess":"","userId":0}]



*/
