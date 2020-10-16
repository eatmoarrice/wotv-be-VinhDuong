var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var userRouter = require("./routes/users");
const charactersRouter = require("./routes/characters");
const jobRouter = require("./routes/jobs");
const bossRouter = require("./routes/bosses");
const profileRouter = require("./routes/profile");
const skillRouter = require("./routes/skills");
const boardRouter = require("./routes/boards");
const auth = require("./routes/auth");
require("dotenv").config({ path: ".env" });
var app = express();
const mongoose = require("mongoose");
var cors = require("cors");

// view engine setup
app.use(cors());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(charactersRouter);
app.use(userRouter);
app.use(skillRouter);
app.use(jobRouter);
app.use(bossRouter);
app.use(boardRouter);
app.use("/login", auth); //login
// app.use("/profile", profileRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

mongoose
	.connect(process.env.DB, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log(`Mongoose connected to DB`);
		require("./faker.js");
	})
	.catch((err) => console.error("Could not connect to database!", err));

module.exports = app;
