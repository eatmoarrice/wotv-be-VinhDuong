const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: true,
		trim: true,
		lowercase: true
	},
	name: {
		type: String,
		required: [true, "Name is required"],
		trim: true
	},
	password: {
		type: String,
		required: [true, "Password is required"],
		maxlength: 1024
	},
	type: { type: String, enum: ["user", "editor", "admin"], default: "user" },
	tokens: Array
});

const User = mongoose.model("User", userSchema);

function validateUser(user) {
	const schema = {
		name: Joi.string().min(5).max(50).required(),
		email: Joi.string().min(5).max(255).required(),
		password: Joi.string().min(5).max(1024).required(),
		type: Joi.string().min(4).max(6).required()
	};
	return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
