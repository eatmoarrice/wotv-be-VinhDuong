const express = require("express");
const router = express.Router();

//AUTH
const authAPI = require("./auth.api");
router.use("/login", authAPI);

//USER
const userAPI = require("./user.api");
router.use("/", userAPI);

//CHARACTER
const characterAPI = require("./character.api");
router.use("/characters", characterAPI);

//BOSS
const bossAPI = require("./boss.api");
router.use("/boss", bossAPI);

//SKILL
const skillAPI = require("./skill.api");
router.use("/skill", skillAPI);

//BOARD
const boardAPI = require("./board.api");
router.use("/board", boardAPI);

//JOB

const jobAPI = require("./job.api");
router.use("/job", jobAPI);

module.exports = router;
