const Jimp = require('jimp');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const { text } = require('express');
const cloudinary = require('cloudinary');
const baseImageUrl = 'data/baseImages/unitRes.png';
const fontGreenUrl = 'data/font/georgia_32_green.fnt';
const fontRedUrl = 'data/font/georgia_32_red.fnt';
const fontWhiteUrl = 'data/font/candara_32_white.fnt';
const arrowUpUrl = 'data/img/up.png';
const arrowDownUrl = 'data/img/down.png';
const fs = require('fs');
require('dotenv').config({ path: '.env' });
cloudinary.config({
	cloud_name: 'wotv',
	api_key: process.env.CLOUD_API,
	api_secret: process.env.CLOUD_SECRET,
});

console.log(process.env.CLOUD_API);

const coords = {
	name: [50, 721],
	avatar: [37, 179],
	job1: [],
	job2: [],
	job3: [],
	slash: [484, 237],
	pierce: [605, 237],
	strike: [726, 237],
	missile: [847, 237],
	magic: [968, 237],
	fire: [484, 399],
	ice: [605, 399],
	earth: [726, 399],
	wind: [847, 399],
	lightning: [484, 516],
	water: [605, 516],
	light: [726, 516],
	dark: [847, 516],
	poison: [484, 680],
	blind: [605, 680],
	sleep: [726, 680],
	silence: [847, 680],
	paralyze: [968, 680],
	confusion: [484, 800],
	petrify: [605, 800],
	toad: [726, 800],
	charm: [847, 800],
	slow: [968, 800],
	stop: [484, 917],
	immobilize: [605, 917],
	disable: [726, 917],
	berserk: [847, 917],
	doom: [968, 917],
};

module.exports = exports = async function createUnitResImage(name, ref, resistance, job1, job2, job3) {
	try {
		if (fs.existsSync('public/img/char/' + ref + '.png')) {
			return '';
		}
	} catch (err) {
		console.error(err);
	}
	const baseImage = await Jimp.read(baseImageUrl);
	const fontGreen = await Jimp.loadFont(fontGreenUrl);
	const fontRed = await Jimp.loadFont(fontRedUrl);
	const fontWhite = await Jimp.loadFont(fontWhiteUrl);
	const arrowUp = await Jimp.read(arrowUpUrl);
	const arrowDown = await Jimp.read(arrowDownUrl);
	let j1, j2, j3;
	let url = '';
	try {
		j1 = await Jimp.read(`data/img/mainjob/${job1.replace(/[^a-z0-9]+/gi, '')}.png`);
	} catch (err) {
		j1 = await Jimp.read(`data/img/mainjob/unknown.png`);
	}

	try {
		j2 = await Jimp.read(`data/img/subjob/${job2.replace(/[^a-z0-9]+/gi, '')}.png`);
	} catch (err) {
		j2 = await Jimp.read(`data/img/subjob/unknown.png`);
	}

	try {
		j3 = await Jimp.read(`data/img/subjob/${job3.replace(/[^a-z0-9]+/gi, '')}.png`);
	} catch (err) {
		j3 = await Jimp.read(`data/img/subjob/unknown.png`);
	}

	arrowUp.resize(Jimp.AUTO, 60);
	arrowDown.resize(Jimp.AUTO, 60);
	const avatar = await Jimp.read(`data/source/${ref}_m.png`);
	avatar.autocrop(0.1);
	let textImage = await Jimp.read('data/img/transparent.png');
	let keys = Object.entries(resistance);
	if (keys[0][0] == '$init') keys.splice(0, 1);
	for (const [key, value] of keys) {
		console.log(`${key}: ${value}`);
		let number = value + '%';
		let offsetX = 0;
		if (value > 0) {
			if (value >= 100) {
				offsetX = 5;
				number = 'Imm.';
			}

			textImage.composite(arrowUp, coords[key][0] + 30, coords[key][1] - 60);
			textImage.print(fontGreen, coords[key][0] - offsetX, coords[key][1], number);
		} else if (value < 0) {
			textImage.composite(arrowDown, coords[key][0] + 30, coords[key][1] - 60);
			textImage.print(fontRed, coords[key][0], coords[key][1], number);
		} else {
			textImage.print(fontWhite, coords[key][0] + 20, coords[key][1], '--');
		}
	}

	textImage.print(
		fontWhite,
		coords.name[0],
		coords.name[1],
		{
			text: name,
			alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
		},
		316,
		0
	);
	let avatarDim = {};
	avatarDim.width = avatar.bitmap.width;
	avatarDim.height = avatar.bitmap.height;
	let leftGap = (350 - avatarDim.width) / 2;
	let topGap = (442 - avatarDim.height) / 2;
	baseImage.composite(j1, 55, 620);
	baseImage.composite(j2, 170, 620);
	baseImage.composite(j3, 285, 620);
	baseImage.composite(avatar, coords.avatar[0] + leftGap, coords.avatar[1] + topGap);
	baseImage.composite(textImage, 0, 0);

	await baseImage.writeAsync('public/img/char/' + ref + '.png');
	await compressPic('public/img/char/' + ref + '.png', 'public/img/char');
	await cloudinary.v2.uploader.upload('public/img/char/' + ref + '.png', { folder: 'unitRes' }, function (error, result) {
		console.log(result, error);
		url = result.url;
	});
	return url;
};

const compressPic = async (inputPath, outputPath) => {
	const files = await imagemin([inputPath], {
		destination: outputPath,
		plugins: [
			imageminJpegtran(),
			imageminPngquant({
				quality: [0.6, 0.8],
			}),
		],
	});
};
