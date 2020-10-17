const { User } = require("../models/user");

exports.createUser = async (req, res, next) => {
	try {
		const { username, email, password } = req.body;
		if (!username || !email || !password) throw new Error("Username, email and password are required!");
		const user = await new User({ username, email, password });
		user.save();
		res.status(200).json({
			status: "success",
			data: user
		});
	} catch (error) {
		return res.status(400).json({
			status: "Fail",
			message: error.message
		});
	}
};
