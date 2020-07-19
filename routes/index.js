const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const users = require("./users");
var express = require("express");
var router = express.Router();
// var cors = require("cors");
// require("dotenv").config({ path: ".env" });

var app = express();

/* GET home page. */

mongoose
	.connect(process.env.DB, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	})
	.then(() => console.log("connected to database"))
	.catch((err) => console.error("Could not connect to database!", err));

app.use(express.json());
app.use("/users/login", users);

module.exports = router;
