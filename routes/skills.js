var express = require("express");
const { getSingleSkill, createSkill } = require("../controllers/skillController");

var router = express.Router();

router.route("/skill/:name").get(getSingleSkill);
router.route("/skill/create").post(createSkill);

// .post(requiresLogin, requiresHost, createExperience)

// router.route("characters/:name");
// .put(requiresLogin, requiresHost, updateExperience)
// .put(updateExperience)
// .get(findOneExperience);

module.exports = router;
