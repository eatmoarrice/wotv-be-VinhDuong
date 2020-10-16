const { User } = require("./models/user");
const faker = require("faker");
const mongoose = require("mongoose");

const generateUsers = async (userNumber) => {
	console.log("----------------------------");
	console.log(`Creating ${userNumber} user(s):`);
	for (let i = 0; i < userNumber; i++) {
		await User.create({
			username: faker.internet.userName(),
			email: faker.internet.email(),
			password: "123" //faker.internet.password()
		}).then(function (user) {
			console.log(`Created user: ${user.username}`);
		});
	}
};

generateUsers(5);
