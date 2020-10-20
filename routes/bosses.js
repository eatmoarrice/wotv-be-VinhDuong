var express = require('express');
const { getAllBosses, createBoss, getSingleBoss, getSingleBossByName, updateBoss } = require('../controllers/bossController');
const { auth, isEditor } = require('../controllers/authController');

var router = express.Router();

router.route('/boss').get(getAllBosses);
router.route('/boss/name/:name').get(getSingleBossByName);
router.route('/boss/:id').get(getSingleBoss).patch(auth, isEditor, updateBoss);
router.route('/boss/create').post(auth, isEditor, createBoss);

module.exports = router;
