const { Boss } = require('../models/boss');
const { response } = require('express');
const Jimp = require('jimp');
const cloudinary = require('cloudinary');
const { nextTick } = require('process');

const baseImageUrl = 'public/img/base.png';
const fontGreenUrl = 'public/font/georgia_20_green.fnt';
const fontRedUrl = 'public/font/georgia_20_red.fnt';
const fontWhiteUrl = 'public/font/georgia_20_white.fnt';
const arrowUpUrl = 'public/img/up.png';
const arrowDownUrl = 'public/img/down.png';

cloudinary.config({
	cloud_name: 'wotv',
	api_key: process.env.CLOUD_API,
	api_secret: process.env.CLOUD_SECRET,
});

const coords = {
	slash: [34, 95],
	missile: [106, 95],
	strike: [178, 95],
	pierce: [250, 95],
	magic: [322, 95],
	fire: [34, 212],
	ice: [106, 212],
	wind: [178, 212],
	earth: [250, 212],
	lightning: [322, 212],
	water: [394, 212],
	light: [466, 212],
	dark: [538, 212],
	poison: [34, 326],
	blind: [106, 326],
	sleep: [178, 326],
	silence: [250, 326],
	paralyze: [322, 326],
	confusion: [394, 326],
	petrify: [466, 326],
	toad: [538, 326],
	charm: [34, 388],
	slow: [106, 388],
	stop: [178, 388],
	immobilize: [250, 388],
	disable: [322, 388],
	berserk: [394, 388],
	doom: [466, 388],
};

exports.getAllBosses = async (request, response) => {
	try {
		const bossList = await Boss.find({}, { desc: 0, res: 0, author: 0 });

		const numDocuments = await Boss.countDocuments();

		response
			.status(200)
			.json({
				status: 'success',
				data: bossList,
				total: numDocuments,
			})
			.send(bossList);
	} catch (error) {
		return response.status(400).json({
			status: 'Fail',
			message: error,
		});
	}
};

exports.getSingleBoss = async (request, response) => {
	try {
		const bossDetails = await Boss.findById(request.params.id);

		response
			.status(200)
			.json({
				status: 'success',
				data: bossDetails,
			})
			.send(bossDetails);
	} catch (error) {
		return response.status(400).json({
			status: 'Fail',
			message: error.message,
		});
	}
};

exports.getSingleBossByName = async (request, response) => {
	try {
		const bossDetails = await Boss.findById(request.params.name);

		response
			.status(200)
			.json({
				status: 'success',
				data: bossDetails,
			})
			.send(bossDetails);
	} catch (error) {
		return response.status(400).json({
			status: 'Fail',
			message: error.message,
		});
	}
};

exports.createBoss = async (request, response) => {
	try {
		let boss = await Boss.findOne({ name: { $regex: request.body.name, $options: 'i' } });
		if (boss) return response.status(400).send('This boss already exists');
		boss = new Boss(request.body);
		let image = await processImage(boss);
		boss.url = image;
		await boss.save();

		response.send({ status: 'success', name: boss.name });
	} catch (error) {
		return response.status(400).json({
			status: 'Fail',
			message: `Could not create new boss ${error.message}`,
		});
	}
};

exports.updateBoss = async (request, response, next) => {
	try {
		const boss = await Boss.findById(request.params.id);
		if (!boss) {
			throw new Error('There is no such boss');
		}
		const bossFields = Object.keys(request.body);
		bossFields.map((field) => (boss[field] = request.body[field]));
		let image = await processImage(boss);
		boss.url = image;
		await boss.save();

		response.status(200).json({
			status: 'Success',
			data: boss,
		});
	} catch (error) {
		return response.status(400).json({
			status: 'Fail',
			message: `Could not edit existing boss ${error.message}`,
		});
	}
};

const processImage = async ({ name, res }) => {
	let textImage = await Jimp.read('public/img/transparent.png');
	const baseImage = await Jimp.read(baseImageUrl);
	const fontGreen = await Jimp.loadFont(fontGreenUrl);
	const fontRed = await Jimp.loadFont(fontRedUrl);
	const fontWhite = await Jimp.loadFont(fontWhiteUrl);
	const arrowUp = await Jimp.read(arrowUpUrl);
	const arrowDown = await Jimp.read(arrowDownUrl);
	let url = '';
	for (const [key, value] of Object.entries(res)) {
		let number = value + '%';
		let offsetX = 0;
		if (value > 0) {
			if (value >= 100) {
				offsetX = 5;
				number = 'Imm.';
			}
			textImage.composite(arrowUp, coords[key][0] + 20, coords[key][1] - 28);
			textImage.print(fontGreen, coords[key][0] - offsetX, coords[key][1], number);
		} else if (value < 0) {
			textImage.composite(arrowDown, coords[key][0] + 20, coords[key][1] - 28);
			textImage.print(fontRed, coords[key][0], coords[key][1], number);
		} else textImage.print(fontWhite, coords[key][0] + 9, coords[key][1], '--');
	}

	baseImage.composite(textImage, 0, 0);

	await baseImage.writeAsync('public/img/boss/' + name + '.png');
	await cloudinary.v2.uploader.upload('public/img/boss/' + name + '.png', { folder: 'bosses' }, function (error, result) {
		console.log(result, error);
		url = result.url;
	});
	return url;
};
