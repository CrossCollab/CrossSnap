const router = require("express").Router();
const GameInstance = require("../db/models/gameInstance");
const User = require("../db/models/user");

module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const game = await GameInstance.findOne({
      where: {
        id: 1
      }
    });
    let guessesAnswers = {
      answers: game.answers,
      guesses: game.guesses,
      numbers: game.numbers,
      across: game.across,
      down: game.down
    };
    res.json(guessesAnswers);
  } catch (err) {
    next(err);
  }
});

router.get("/:gameId", async (req, res, next) => {
  try {
    const game = await GameInstance.findOne({
      where: {
        id: req.params.gameId
      }
    });
    let guessesAnswers = {
      answers: game.answers,
      guesses: game.guesses,
      numbers: game.numbers,
      across: game.across,
      down: game.down
    };
    res.json(guessesAnswers);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    //create new game instance using the selected cw id sent along req.body
    const { userId, newGameInstance } = req.body;
    const gameInstance = await GameInstance.create(newGameInstance);
    //add a user to that game instance (later this will be sent along req.body as well)
    const user = await User.findByPk(userId);
    await gameInstance.addUser(user);
    res.json(gameInstance);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { guesses } = req.body;
    const jsonGuesses = JSON.stringify(guesses);
    const gameInstance = await GameInstance.findOne({
      where: { id: req.params.id }
    });
    const updatedInstance = await gameInstance.update({
      guesses: jsonGuesses,
      status: "filled"
    });
    res.send(updatedInstance);
  } catch (err) {
    next(err);
  }
});
