var express = require("express");
const { getAllCharacters } = require("../controllers/characterController");

var router = express.Router();

router.route("/").get(getAllCharacters);
// .post(requiresLogin, requiresHost, createExperience)

router.route("/:name");
// .put(requiresLogin, requiresHost, updateExperience)
// .put(updateExperience)
// .get(findOneExperience);

module.exports = router;
