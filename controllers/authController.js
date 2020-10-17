const { User } = require('../models/user');
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			throw new Error('no password or email');
		}
		const user = await User.loginWithEmail(email, password);
		const token = user.generateToken();
		res.status(200).json({
			status: true,
			data: { user, token },
		});
	} catch (err) {
		res.status(400).json({
			status: false,
			massage: err.message,
		});
	}
};

exports.auth = async (req, res, next) => {
	// make sure we get the token
	if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) return res.status(401).json({ status: 'fail', message: 'Unauthorized' });

	// verify token
	const token = req.headers.authorization.replace('Bearer ', '');
	try {
		const decoded = jwt.verify(token, process.env.HASH_SECRET);
		// find User with token
		const user = await User.findOne({ _id: decoded.id });
		if (!user) throw new Error('Unauthorized');

		// attach user object to req object
		req.user = user;
	} catch (err) {
		return res.status(401).json({ status: 'fail', message: err.message });
	}
	next();
};

exports.isEditor = async (req, res, next) => {
	try {
		if (req.user.type != 'editor') throw new Error('Unauthorized');
	} catch (err) {
		return res.status(401).json({ status: 'fail', message: err.message });
	}
	next();
};

exports.isAdmin = async (req, res, next) => {
	try {
		if (req.user.type != 'admin') throw new Error('Unauthorized');
	} catch (err) {
		return res.status(401).json({ status: 'fail', message: err.message });
	}
	next();
};
