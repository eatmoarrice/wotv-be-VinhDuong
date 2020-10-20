const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv");
const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			trim: true,
			lowercase: true,
			validate(val) {
				if (!validator.isEmail(val)) {
					throw new Error("Invalid email address");
				}
			}
		},
		username: {
			type: String,
			// required: [true, "Username is required"],
			trim: true,
			unique: true
		},
		password: {
			type: String,
			required: [true, "Password is required"]
		},
		type: { type: String, enum: ["user", "editor", "admin"], default: "user" },
		name: String,
		avatarUrl: String,
		firstName: String,
		lastName: String,
		id: String,
		emailVerified: { type: Boolean, default: false },
		emailVerificationCode: Number
	},

	{
		timestamps: true
	}
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, saltRounds);
	next();
});

userSchema.statics.loginWithEmail = async (email, password) => {
	const user = await User.findOne({ email: email });
	if (!user) {
		throw new Error("User does not exist!");
	}

	const match = await bcrypt.compare(password, user.password);
	if (!match) {
		throw new Error("Incorrect password");
	}

	return user;
};

userSchema.methods.generateToken = function () {
	const user = this;
	const token = jwt.sign({ id: user._id }, process.env.HASH_SECRET, { expiresIn: "7d" });
	return token;
};

const User = mongoose.model("User", userSchema);

exports.User = User;
