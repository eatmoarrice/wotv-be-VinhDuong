var express = require("express");
const { getAllJobs } = require("../controllers/jobController");
// const { route } = require("./users");

var router = express.Router();

router.route("/jobs").get(getAllJobs);

module.exports = router;
