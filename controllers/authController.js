const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const { catchAsync } = require("../helpers/utilsHelper");
const bcrypt = require("bcrypt");

exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			throw new Error("no password or email");
		}
		const user = await User.loginWithEmail(email, password);
		const token = user.generateToken();
		res.status(200).json({
			status: true,
			data: { user, token }
		});
	} catch (err) {
		res.status(400).json({
			status: false,
			massage: err.message
		});
	}
};

exports.auth = async (req, res, next) => {
	// make sure we get the token
	if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) return res.status(401).json({ status: "fail", message: "Unauthorized" });

	// verify token
	const token = req.headers.authorization.replace("Bearer ", "");
	try {
		const decoded = jwt.verify(token, process.env.HASH_SECRET);
		// find User with token
		const user = await User.findOne({ _id: decoded.id });
		if (!user) throw new Error("Unauthorized");

		// attach user object to req object
		req.user = user;
	} catch (err) {
		return res.status(401).json({ status: "fail", message: err.message });
	}
	next();
};

exports.isEditor = async (req, res, next) => {
	try {
		if (req.user.type != "editor") throw new Error("Unauthorized");
	} catch (err) {
		return res.status(401).json({ status: "fail", message: err.message });
	}
	next();
};

exports.isAdmin = async (req, res, next) => {
	try {
		if (req.user.type != "admin") throw new Error("Unauthorized");
	} catch (err) {
		return res.status(401).json({ status: "fail", message: err.message });
	}
	next();
};

exports.loginWithFacebookOrGoogle = catchAsync(async (req, res, next) => {
	let profile = req.user;
	console.log(profile);
	profile.email = profile.email.toLowerCase();
	let user = await User.findOne({ email: profile.email });
	console.log("hehehe", user);
	const randomPassword = "" + Math.floor(Math.random() * 10000000);
	const salt = await bcrypt.genSalt(10);
	const newPassword = await bcrypt.hash(randomPassword, salt);
	if (user) {
		if (!user.emailVerified) {
			await User.findByIdAndUpdate(
				user._id,
				{
					$set: { emailVerified: true, avatarUrl: profile.avatarUrl },
					$unset: { emailVerificationCode: 1 }
				},
				{ new: true }
			);
		} else {
			await User.findByIdAndUpdate(user._id, { avatarUrl: profile.avatarUrl }, { new: true });
		}
	} else {
		console.log("no user");
		user = await User.create({
			name: profile.name,
			email: profile.email,
			password: newPassword,
			avatarUrl: profile.avatarUrl
		});
	}

	const accessToken = await user.generateToken();
	res.status(200).json({
		status: true,
		data: { user, accessToken }
	});
});
