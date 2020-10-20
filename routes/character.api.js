var express = require("express");
const { auth, isAdmin, isEditor } = require("../controllers/authController");
const { createResAll, getAllCharacters, createCharacter, getSingleCharacterByID, getSingleCharacter, editCharacter, updateDatabase, createResImg } = require("../controllers/characterController");
// const { route } = require("./users");

var router = express.Router();

router.route("/").get(getAllCharacters);
router.route("//id/:id").get(getSingleCharacterByID);
router.route("//:name").get(getSingleCharacter);
router.route("//id/:id/update").put(editCharacter);
router.route("//create").post(createCharacter);
router.route("//update/update-database").get(auth, isAdmin, updateDatabase);
router.route("//image/:id").post(auth, isAdmin, createResImg);
router.route("//image/").post(auth, isAdmin, createResAll);

// .post(requiresLogin, requiresHost, createExperience)

// router.route("characters/:name");
// .put(requiresLogin, requiresHost, updateExperience)
// .put(updateExperience)
// .get(findOneExperience);

module.exports = router;
