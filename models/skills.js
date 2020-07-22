const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
	name: {
		type: String,
		// required: [true, "Name is required"],
		trim: true
	},
	jp: {
		type: String,
		// required: [true, "Rarity is required"],
		trim: true
		// enum: ["UR", "MR", "SR", "R", "N"]
	},
	effType: {
		type: String,
		// required: [true, "Element is required"],
		trim: true
		// enum: ["Water", "Fire", "Ice", "Wind", "Earth", "Lightning", "Light", "Dark"]
	},
	atkType: String,
	desc: String,
	TP: Number,
	AP: Number,
	uses: Number
});

const Skill = mongoose.model("Skill", skillSchema);

exports.Skill = Skill;
