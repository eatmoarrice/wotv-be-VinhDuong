var express = require("express");
const { getAllBosses, createBoss, getSingleBoss, updateBoss } = require("../controllers/bossController");

var router = express.Router();

router.route("/boss").get(getAllBosses);
router.route("/boss/:name").get(getSingleBoss);
router.route("/boss/update").put(updateBoss);
router.route("/boss/create").post(createBoss);

module.exports = router;
