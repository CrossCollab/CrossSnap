const router = require("express").Router();
const GameInstance = require("../db/models/gameInstance");

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
      guesses: game.guesses
    };
    res.json(guessesAnswers);
  } catch (err) {
    next(err);
  }
});
