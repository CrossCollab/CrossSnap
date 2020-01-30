//this is where we'll do our associations and pull in the models
const User = require("./user");
const Crossword = require("./crossword");
const GameInstance = require("./gameInstance");

GameInstance.belongsTo(Crossword);
Crossword.hasMany(GameInstance);

User.belongsToMany(GameInstance, {
  through: "userInstance"
});

GameInstance.belongsToMany(User, {
  through: "userInstance"
});

User.belongsToMany(User, {
  as: "friends",
  through: "friendList"
});

module.exports = { User, Crossword, GameInstance };
