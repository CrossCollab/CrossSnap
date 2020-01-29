//this is where we'll do our associations and pull in the models
const User = require("./user");
const Crossword = require("./crossword");
const GameInstance = require("./gameInstance");

Crossword.belongsToMany(User, {
  through: GameInstance
});

User.belongsToMany(Crossword, {
  through: GameInstance
});

User.belongsToMany(User, {
  as: "friends",
  through: "friendList"
});

module.exports = { User, Crossword, GameInstance };
