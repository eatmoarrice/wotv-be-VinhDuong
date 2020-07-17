const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const _ = require("lodash");

router.post("/", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	let user = await User.findOne({ email: req.body.email });
	if (user) return res.status(400).send("User already exists");
	user = new User(_.pick(req.body, ["name", "password", "type", "email"]));
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);
	await user.save();
	const token = jwt.sign({ _id: user._id }, process.env.JWTKEY, { expiresIn: "7d" });
	res.header("x-authen-token", token).send({ name: user.name, email: user.email });
});

module.exports = router;
