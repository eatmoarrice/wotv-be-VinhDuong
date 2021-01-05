const mongoose = require('mongoose');

const charSchema = new mongoose.Schema({
	name: {
		type: String,
		// required: [true, "Name is required"],
		trim: true,
	},
	jp_name: {
		type: String,
		trim: true,
	},
	nicknames: [
		{
			type: String,
			// required: [true, "Name is required"],
			trim: true,
		},
	],
	rarity: {
		type: String,
		// required: [true, "Rarity is required"],
		trim: true,
		// enum: ["UR", "MR", "SR", "R", "N"]
	},
	element: {
		type: String,
		// required: [true, "Element is required"],
		trim: true,
		// enum: ["water", "fire", "ice", "wind", "earth", "lightning", "light", "dark"]
	},
	job1: { type: String, default: '' },
	job2: { type: String, default: '' },
	job3: { type: String, default: '' },
	limited: Boolean,
	description: String,
	desc: String,
	stats: Object,
	// board: Array,
	special: Object,
	vetted: { type: Boolean, default: true },
	res: {
		slash: { type: Number, default: 0 },
		pierce: { type: Number, default: 0 },
		strike: { type: Number, default: 0 },
		missile: { type: Number, default: 0 },
		magic: { type: Number, default: 0 },
		fire: { type: Number, default: 0 },
		ice: { type: Number, default: 0 },
		wind: { type: Number, default: 0 },
		earth: { type: Number, default: 0 },
		lightning: { type: Number, default: 0 },
		water: { type: Number, default: 0 },
		light: { type: Number, default: 0 },
		dark: { type: Number, default: 0 },
		poison: { type: Number, default: 0 },
		blind: { type: Number, default: 0 },
		sleep: { type: Number, default: 0 },
		silence: { type: Number, default: 0 },
		paralyze: { type: Number, default: 0 },
		confusion: { type: Number, default: 0 },
		petrify: { type: Number, default: 0 },
		toad: { type: Number, default: 0 },
		charm: { type: Number, default: 0 },
		slow: { type: Number, default: 0 },
		stop: { type: Number, default: 0 },
		immobilize: { type: Number, default: 0 },
		disable: { type: Number, default: 0 },
		berserk: { type: Number, default: 0 },
		doom: { type: Number, default: 0 },
	},
	master: String,
	ref: String,
	resImgUrl: String,
	statImgUrl: String,
});

const Character = mongoose.model('Character', charSchema);

exports.Character = Character;
