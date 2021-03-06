const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validators = require("../middlewares/validators");
const { body } = require("express-validator");

router.post(
	"/",
	validators.validate([
		body("name", "Invalid name").exists().notEmpty(),
		body("email", "Invalid email").exists().isEmail(),
		body("password", "Invalid password").exists().notEmpty()
	]),
	userController.register
);

module.exports = router;
