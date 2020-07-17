const { User } = require("../models/user");
const mongoose = require("mongoose");
const loginRequired = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const router = express.Router();

router.get("/", loginRequired, async (req, res) => {});

module.exports = router;
