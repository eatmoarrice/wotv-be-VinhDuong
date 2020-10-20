var express = require("express");
const { getSingleSkill, createSkill } = require("../controllers/skillController");

var router = express.Router();

router.route("/:name").get(getSingleSkill);
router.route("/create").post(createSkill);

// .post(requiresLogin, requiresHost, createExperience)

// router.route("characters/:name");
// .put(requiresLogin, requiresHost, updateExperience)
// .put(updateExperience)
// .get(findOneExperience);

module.exports = router;
