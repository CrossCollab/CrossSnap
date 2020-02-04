const router = require("express").Router();
const User = require("../db/models/user");
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

// User signup route
router.post("/signup", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    req.login(user, err => (err ? next(err) : res.json(user)));
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(401).send("User already exists");
    } else {
      next(err);
    }
  }
});
