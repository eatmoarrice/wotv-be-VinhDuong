const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
	forID: mongoose.Schema.Types.ObjectId,
	owner: String,
	board: Array
});

const Board = mongoose.model("Board", boardSchema);

exports.Board = Board;
