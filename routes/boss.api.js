var express = require("express");
const { getAllBosses, createBoss, getSingleBoss, getSingleBossByName, updateBoss } = require("../controllers/bossController");
const { auth, isEditor } = require("../controllers/authController");

var router = express.Router();

router.route("/").get(getAllBosses);
router.route("/name/:name").get(getSingleBossByName);
router.route("/:id").get(getSingleBoss).patch(auth, isEditor, updateBoss);
router.route("/create").post(auth, isEditor, createBoss);

module.exports = router;
