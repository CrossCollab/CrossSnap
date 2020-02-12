const router = require("express").Router();
const User = require("../db/models/user");
const Crossword = require("../db/models/crossword");
const GameInstance = require("../db/models/gameInstance");
const Op = require("Sequelize").Op;
module.exports = router;

// User Profile
router.get("/:userid/userprofile", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.userid
      }
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Placeholder route; not actually used by client, more for testing purposes
router.get("/allusers", async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Pulls a specific user's active crosswords
router.get("/:userid/activecrosswords", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.userid
      }
    });

    const activeCrosswords = await user.getGameInstances({
      where: {
        status: {
          [Op.or]: ["incomplete", "filled"]
        }
      },
      include: [
        {
          model: Crossword
        }
      ]
    });
    res.json(activeCrosswords);
  } catch (err) {
    next(err);
  }
});

// Join an existing game and commit the gameInstace - UserId connection to the database
router.post("/joingame", async (req, res, next) => {
  try {
    const { userId, gameInstanceId } = req.body;

    const user = await User.findOne({
      where: {
        id: userId
      }
    });
    // console.log("user", user);
    // console.log("Magic methods inside joingame route", user.__proto__);

    const game = await GameInstance.findOne({
      where: {
        id: gameInstanceId
      },
      include: [
        {
          model: Crossword
        }
      ]
    });
    // console.log("game", game);

    const joinedGame = await user.addGameInstance(game);

    res.send(game);
  } catch (err) {
    next(err);
  }
});

// User signup route
router.post("/signup", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    // req.login(user, err => (err ? next(err) : res.json(user)));
    res.send(user);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(401).send("User already exists");
    } else {
      next(err);
    }
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await User.findOne({ where: { email, password } });
    if (data) {
      res.send(data);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
});
