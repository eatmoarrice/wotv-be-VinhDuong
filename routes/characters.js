var express = require('express');
const { createResAll, getAllCharacters, createCharacter, getSingleCharacterByID, getSingleCharacter, editCharacter, updateDatabase, createResImg } = require('../controllers/characterController');
// const { route } = require("./users");

var router = express.Router();

router.route('/characters').get(getAllCharacters);
router.route('/characters/id/:id').get(getSingleCharacterByID);
router.route('/characters/:name').get(getSingleCharacter);
router.route('/characters/id/:id/update').put(editCharacter);
router.route('/characters/create').post(createCharacter);
router.route('/characters/update/update-database').get(updateDatabase);
// router.route('/characters/image/:id').post(createResImg);
// router.route('/characters/image/').post(createResAll);

// .post(requiresLogin, requiresHost, createExperience)

// router.route("characters/:name");
// .put(requiresLogin, requiresHost, updateExperience)
// .put(updateExperience)
// .get(findOneExperience);

module.exports = router;
