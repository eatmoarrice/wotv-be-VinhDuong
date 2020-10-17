const { Skill } = require("../models/skill");

exports.getSingleSkill = async (request, response) => {
	try {
		// const element = request.query.element || "";
		// const rarity = request.query.rarity || "";
		// const job = requiest.query.job || "";

		const skillDetails = await Skill.findOne({
			name: request.params.name
			// element: { $in: element },
			// rarity: { $in: rarity }
		});

		response
			.status(200)
			.json({
				status: "success",
				data: skillDetails
			})
			.send(skillDetails);
	} catch (error) {
		return response.status(400).json({
			status: "Fail",
			message: error
		});
	}
};

exports.createSkill = async (request, response) => {
	try {
		let skill = await Skill.findOne({ name: request.body.name });
		if (skill) return response.status(400).send("Skill already exists");
		char = new Skill(request.body);
		console.log("har", char);
		await char.save();

		response.send({ status: "success", name: skill.name });
	} catch (error) {
		return response.status(400).json({
			status: "Fail",
			message: "Could not create new skill"
		});
	}
};
