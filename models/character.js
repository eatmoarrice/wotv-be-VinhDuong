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
		required: [true, "Element is required"],
		trim: true
		// enum: ["water", "fire", "ice", "wind", "earth", "lightning", "light", "dark"]
	},
	job1: String,
	job2: String,
	job3: String,
	stylized: String,
	limited: Boolean,
	desc: String,
	fullName: String,
	stats: Object,
	board: Array,
	vetted: Boolean,
	res: Object
});

const Character = mongoose.model("Character", charSchema);

exports.Character = Character;
