const Sequelize = require("sequelize");
const db = require("../db");

const Crossword = db.define("crossword", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: Sequelize.TEXT
  },
  difficulty: {
    type: Sequelize.ENUM("easy", "medium", "hard")
  },
  size: {
    type: Sequelize.ENUM("small", "medium", "big")
  },
  date: {
    type: Sequelize.STRING //format M/D/YYYY
  },
  theme: {
    type: Sequelize.STRING
  },
  crosswordObjectString: {
    type: Sequelize.JSON
  }
});

module.exports = Crossword;
