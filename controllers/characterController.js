const { Character } = require("../models/character");
const { Board } = require("../models/board");
const { response } = require("express");
const { extractSheets } = require("spreadsheet-to-json");
const fs = require("fs");
const formatCell = (sheetTitle, columnTitle, value) => columnTitle.toLowerCase();

exports.getAllCharacters = async (request, response) => {
	try {
		// const element = request.query.element || "";
		// const rarity = request.query.rarity || "";
		// const job = requiest.query.job || "";

		const charList = await Character.find(
			{
				vetted: true
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

exports.getSingleCharacterByID = async (request, response) => {
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

exports.getSingleCharacter = async (request, response) => {
	try {
		const charDetails = await Character.findOne({ $or: [{ name: request.params.name }, { shortname: request.params.name }] });

		response
			.status(200)
			.json({
				status: "success",
				data: charDetails
			})
			.send(charDetails);
	} catch (error) {
		console.log(error);
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

exports.updateDatabase = async (request, response, next) => {
	try {
		console.log("here");
		const charList = await Character.find({});
		let newArray = [];
		let skip = ["secret key", "profile"];
		let resArray = [
			"fire",
			"ice",
			"earth",
			"wind",
			"lightning",
			"water",
			"light",
			"dark",
			"slash",
			"pierce",
			"strike",
			"missile",
			"magic",
			"poison",
			"blind",
			"sleep",
			"silence",
			"paralyze",
			"confusion",
			"petrify",
			"toad",
			"charm",
			"slow",
			"stop",
			"immobilize",
			"disable",
			"berserk",
			"doom"
		];
		await extractSheets(
			{
				// your google spreadhsheet key
				spreadsheetKey: "1Azn8UY3MapOmuVtdq2dfUqWCJv-cIqc3yeXduV0_oIo",
				// your google oauth2 credentials or API_KEY
				credentials: require("../cred/cred.json"),
				// optional: names of the sheets you want to extract
				sheetsToExtract: ["Export"]
				// optional: custom function to parse the cells
				// formatCell: formatCell
			},
			function (err, data) {
				data.Export.forEach((item) => {
					let newObj = { res: {} };
					for (let [key, value] of Object.entries(item)) {
						// if (skip.includes(key.toLowerCase())) {
						// 	console.log("SKIP THIS: ", key);
						// 	break;
						// }
						let processedValue = value ? value.replace(/%/g, "") : "";
						if (processedValue === "--") processedValue = "";
						if (resArray.includes(key.toLowerCase())) {
							newObj.res[key.toLowerCase()] = processedValue;
						} else newObj[key.toLowerCase()] = processedValue;
					}
					if (newObj.vetted && newObj.vetted === "FALSE") newObj.vetted = false;
					else newObj.vetted = true;
					newArray.push(newObj);
					console.log(newObj.vetted);
				});
			}
		);
		// console.log(newArray);
		let successArray = [];
		for (let i = 0; i < newArray.length; i++) {
			if (!newArray[i].name) continue;
			let char = await Character.findOne({ name: newArray[i].name });
			console.log(newArray[i].name, ": ", char);
			if (!char) {
				char = new Character(newArray[i]);
				console.log("new char", char);
			}
			let board = new Board({ forID: char._id, owner: char.name });
			board.board = Array(60).fill({
				type: "",
				job: "",
				text: ""
			});
			const charFields = Object.keys(newArray[i]);
			charFields.map((field) => (char[field] = newArray[i][field]));
			await char.save();
			await board.save();
			successArray.push(char.name);
		}

		response
			.status(200)
			.json({
				status: "success"
			})
			.send(successArray);
	} catch (error) {
		console.log(error);
		return response.status(400).json({
			status: "Fail",
			message: error
		});
	}
};
