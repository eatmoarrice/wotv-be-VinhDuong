var express = require("express");
const { getAllCharacters, createCharacter } = require("../controllers/characterController");

var router = express.Router();

router.route("/characters").get(getAllCharacters);
router.route("/characters/create").post(createCharacter);
// .post(requiresLogin, requiresHost, createExperience)

// router.route("characters/:name");
// .put(requiresLogin, requiresHost, updateExperience)
// .put(updateExperience)
// .get(findOneExperience);

module.exports = router;
