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

		const charDetails = await Character.findOne({
			name: request.params.name
			// element: { $in: element },
			// rarity: { $in: rarity }
		});

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

// exports.createExperience = async (request, response) => {
// 	try {
// 		const { title, duration, images, country, price } = request.body;

// 		if (!title || !duration || !images || !country || !price) {
// 			return response.status(400).json({
// 				message: "Title, Duration, Images, Country and Price are required"
// 			});
// 		}

// 		const newExperience = await Experience.create(request.body);

// 		response.status(200).json({
// 			status: "Success",
// 			data: newExperience
// 		});
// 	} catch (error) {
// 		response.status(400).json({
// 			status: "Fail",
// 			message: error.message
// 		});
// 	}
// };

// exports.findOneExperience = async (request, response) => {
// 	try {
// 		// why params

// 		const exp = await Experience.findOne({ _id: request.params.experienceId });
// 		if (!exp) throw new Error("No experience here");

// 		const owner = await User.findOne({ _id: exp.owner });

// 		console.log(exp);
// 		response.status(200).json({
// 			status: "Success",
// 			data: { exp: exp, ownerInfo: owner }
// 		});
// 	} catch (error) {
// 		response.status(400).json({
// 			status: "Fail",
// 			message: error.message
// 		});
// 	}
// };
