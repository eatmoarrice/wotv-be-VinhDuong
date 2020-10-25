const mailgun = require("mailgun-js");
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });

const sendVerifyEmail = () => {
	const data = {
		from: "No Reply <noreply@wotv-guide.com>",
		to: "xvinh.ir@gmail.com",
		subject: "Test No2",
		template: "verify_email",
		text: "From Vinh",

		"v:name": "Ola",
		"v:verify_url": "https://github.com/"
	};
	mg.messages().send(data, function (error, body) {
		console.log(body);
	});
};

module.exports = {
	sendVerifyEmail
};
