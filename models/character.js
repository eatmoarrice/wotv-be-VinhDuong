const mongoose = require("mongoose");

const charSchema = new mongoose.Schema({
	name: {
		type: String,
		// required: [true, "Name is required"],
		trim: true
	},
	rarity: {
		type: String,
		// required: [true, "Rarity is required"],
		trim: true
		// enum: ["UR", "MR", "SR", "R", "N"]
	},
	element: {
		type: String,
		// required: [true, "Element is required"],
		trim: true
		// enum: ["Water", "Fire", "Ice", "Wind", "Earth", "Lightning", "Light", "Dark"]
	},
	job1: String,
	job2: String,
	job3: String,
	stylized: String,
	limited: Boolean
});

const Character = mongoose.model("Character", charSchema);

exports.Character = Character;
