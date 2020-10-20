const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.route("/register").post(userController.createUser);

module.exports = router;
