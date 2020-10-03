const { Boss } = require("../models/boss");
const { response } = require("express");

exports.getAllBosses = async (request, response) => {
	try {
		const bossList = await Boss.find({}, { desc: 0, res: 0, author: 0 });

		const numDocuments = await Boss.countDocuments();

		response
			.status(200)
			.json({
				status: "success",
				data: bossList,
				total: numDocuments
			})
			.send(bossList);
	} catch (error) {
		return response.status(400).json({
			status: "Fail",
			message: error
		});
	}
};

exports.getSingleBoss = async (request, response) => {
	try {
		const bossDetails = await Boss.findOne({ name: { $regex: request.params.name, $options: "i" } });

		response
			.status(200)
			.json({
				status: "success",
				data: bossDetails
			})
			.send(bossDetails);
	} catch (error) {
		return response.status(400).json({
			status: "Fail",
			message: error
		});
	}
};

exports.createBoss = async (request, response) => {
	try {
		let boss = await Boss.findOne({ name: { $regex: request.params.name, $options: "i" } });
		if (boss) return response.status(400).send("This boss already exists");
		boss = new Boss(request.body);

		await char.save();

		response.send({ status: "success", name: boss.name });
	} catch (error) {
		return response.status(400).json({
			status: "Fail",
			message: "Could not create new boss"
		});
	}
};
