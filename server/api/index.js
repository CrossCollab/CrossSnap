const router = require("express").Router();

module.exports = router;

router.use("/gameInstance", require("./gameInstance"));

router.use("/", require("./user"));

router.use("/crossword", require("./crossword"));

router.use((req, res, next) => {
  const error = new Error("not found");
  error.status = 404;
  next(error);
});
