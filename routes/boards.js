var express = require("express");
const { getBoard } = require("../controllers/boardController");

var router = express.Router();

router.route("/board/:id").get(getBoard);

module.exports = router;
