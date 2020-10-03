const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "name is required"],
		trim: true
	},
	element: {
		type: String,
		required: [true, "Element is required"],
		trim: true,
		enum: ["Dark", "Light", "Water", "Fire", "Lightning", "Ice", "Wind", "Earth"]
	},
	job1: {
		type: String,
		required: [true, "Job 1 is required"],
		trim: true
	},
	job2: {
		type: String,
		required: [true, "Job 2 is required"],
		trim: true
	},
	job3: {
		type: String,
		required: [true, "Job 3 is required"],
		trim: true
	},
	new: {
		type: Boolean
	},
	limited: {
		type: Boolean
	},
	rarity: {
		type: String,
		required: [true, "Rarity is required"],
		trim: true,
		enum: ["UR", "MR", "SR", "R", "N"]
	},
	Stylized: String
});

const Job = mongoose.model("Job", jobSchema);

exports.Job = Job;
