const { User } = require("../models/user");
const { AppError, catchAsync, sendResponse } = require("../helpers/utilsHelper");

exports.register = async (req, res, next) => {
	try {
		const { name, email, password } = req.body;
		if (!name || !email || !password) throw new Error("Name, email and password are required!");
		let user = await User.findOne({ email });
		if (user) throw new Error("User already exists");
		user = await new User({ name, email, password });
		user.save();
		res.status(200).json({
			status: "success",
			data: user
		});
	} catch (error) {
		console.log("erer", error);
		return res.status(400).json({
			status: "Fail",
			message: error
		});
	}
};

exports.verifyEmail = catchAsync(async (req, res, next) => {
	const { code } = req.body;
	let user = await User.findOne({
		emailVerificationCode: code
	});
	if (!user) {
		return next(new AppError(400, "Invalid Verification Code", "Verify Email Error"));
	}
	user = await User.findByIdAndUpdate(
		user._id,
		{
			$set: { emailVerified: true },
			$unset: { emailVerificationCode: 1 }
		},
		{ new: true }
	);
	return sendResponse(res, 200, true, { user }, null, "Email successfully verified!");
});
