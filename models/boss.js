const { string } = require("joi");
const mongoose = require("mongoose");

const bossSchema = new mongoose.Schema({
	name: {
		type: String,
		// required: [true, "Name is required"],
		trim: true
	},
	element: {
		type: String,
		// required: [true, "Element is required"],
		trim: true,
		enum: ["water", "fire", "ice", "wind", "earth", "lightning", "light", "dark", "none"]
	},
	res: Object,
	author: String
});

const Boss = mongoose.model("Boss", bossSchema);

exports.Boss = Boss;
