const { Character } = require("../models/character");
const { response } = require("express");

exports.getAllCharacters = async (request, response) => {
	try {
		// const element = request.query.element || "";
		// const rarity = request.query.rarity || "";
		// const job = requiest.query.job || "";

		const charList = await Character.find(
			{
				// element: { $in: element },
				// rarity: { $in: rarity }
			},
			{ desc: 0, fullName: 0, board: 0 }
		);

		const numDocuments = await Character.countDocuments();

		response
			.status(200)
			.json({
				status: "success",
				data: charList,
				total: numDocuments
			})
			.send(charList);
	} catch (error) {
		return response.status(400).json({
			status: "Fail",
			message: error
		});
	}
};

exports.getSingleCharacter = async (request, response) => {
	try {
		// const element = request.query.element || "";
		// const rarity = request.query.rarity || "";
		// const job = requiest.query.job || "";

		const charDetails = await Character.findById(request.params.id);

		response
			.status(200)
			.json({
				status: "success",
				data: charDetails
			})
			.send(charDetails);
	} catch (error) {
		return response.status(400).json({
			status: "Fail",
			message: error
		});
	}
};

exports.createCharacter = async (request, response) => {
	try {
		let char = await Character.findOne({ name: request.body.name });
		if (char) return response.status(400).send("Character already exists");
		char = new Character(request.body);
		console.log("har", char);
		await char.save();

		response.send({ status: "success", name: char.name });
	} catch (error) {
		return response.status(400).json({
			status: "Fail",
			message: "Could not create new character"
		});
	}
};

exports.editCharacter = async (request, response, next) => {
	try {
		let char = await Character.findById(request.params.id);
		if (!char) {
			throw new Error("There is no such character");
		}
		if (request.body.key !== "PandaEatsRice420") throw new Error("No entry!");
		const charFields = Object.keys(request.body);
		charFields.map((field) => (char[field] = request.body[field]));
		await char.save();

		response.send({ status: "success", name: char.name });
	} catch (error) {
		console.log(error);
		return response.status(400).json({
			status: "Fail",
			message: error.message
		});
	}
};
