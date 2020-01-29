const Sequelize = require("sequelize");
const db = require("../db");

const GameInstance = db.define("gameInstance", {
  guesses: {
    type: Sequelize.JSON
  },
  answers: {
    type: Sequelize.JSON
  },
  status: {
    type: Sequelize.ENUM("incomplete", "filled", "correct")
  }
});

module.exports = GameInstance;

//let guessArray = [{guess: "", userId: 3}, {guess: "B", userId: 4}]
//let answers = ['a', 'b', '.', 'c', 'd']
//[b,e,a,r,.,e,a,r,.]

// <td id=index innertext = guessArray[index].guess colorstyling=guess

//let answers = Crossword.grid
