const mongoose = require("mongoose");

const charSchema = new mongoose.Schema({
	name: {
		type: String,
		// required: [true, "Name is required"],
		trim: true
	},
	shortname: {
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
		// enum: ["water", "fire", "ice", "wind", "earth", "lightning", "light", "dark"]
	},
	job1: { type: String, default: "" },
	job2: { type: String, default: "" },
	job3: { type: String, default: "" },
	limited: Boolean,
	description: String,
	desc: String,
	stats: Object,
	// board: Array,
	special: Object,
	vetted: { type: Boolean, default: true },
	res: {
		slash: { type: String, default: "" },
		pierce: { type: String, default: "" },
		strike: { type: String, default: "" },
		missile: { type: String, default: "" },
		magic: { type: String, default: "" },
		fire: { type: String, default: "" },
		ice: { type: String, default: "" },
		wind: { type: String, default: "" },
		earth: { type: String, default: "" },
		lightning: { type: String, default: "" },
		water: { type: String, default: "" },
		light: { type: String, default: "" },
		dark: { type: String, default: "" },
		poison: { type: String, default: "" },
		blind: { type: String, default: "" },
		sleep: { type: String, default: "" },
		silence: { type: String, default: "" },
		paralyze: { type: String, default: "" },
		confusion: { type: String, default: "" },
		petrify: { type: String, default: "" },
		toad: { type: String, default: "" },
		charm: { type: String, default: "" },
		slow: { type: String, default: "" },
		stop: { type: String, default: "" },
		immobilize: { type: String, default: "" },
		disable: { type: String, default: "" },
		berserk: { type: String, default: "" },
		doom: { type: String, default: "" }
	}
});

const Character = mongoose.model("Character", charSchema);

exports.Character = Character;
