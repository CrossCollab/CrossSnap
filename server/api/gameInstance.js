const router = require("express").Router();
const GameInstance = require("../db/models/gameInstance");

module.exports = router;

router.get("/", async (req, res, next) => {
  console.log("in backend get route for /api/gameInstance");
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
    console.log("game", game);
    res.json(guessesAnswers);
  } catch (err) {
    next(err);
  }
});
