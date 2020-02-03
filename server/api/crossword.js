const router = require("express").Router();
const Crossword = require("../db/models/crossword");

module.exports = router;

router.get("/:id", async (req, res, next) => {
  console.log("in backend for getting crossword");
  try {
    const crossword = await Crossword.findOne({
      where: {
        id: req.params.id
      }})
    res.send(crossword);
  } catch (err) {
    next(err);
  }
});
router.get("/", async (req, res, next) => {
  try {
    const crosswords = await Crossword.findAll();
    res.json(crosswords);
  } catch (err) {
    next(err);
  }
});
