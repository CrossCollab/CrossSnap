const router = require("express").Router();
const User = require("../db/models/user");
module.exports = router;

router.get("/:userid/homepage", async (req, res, next) => {
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
