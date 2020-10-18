const Jimp = require('jimp');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const { text } = require('express');
const cloudinary = require('cloudinary');
const baseImageUrl = 'data/baseImages/unitRes.png';
const fontGreenUrl = 'data/font/georgia_32_green.fnt';
const fontWhiteUrl = 'data/font/georgia_32_white.fnt';
const fontRedUrl = 'data/font/georgia_32_red.fnt';
const fontTealUrl = 'data/font/georgia_32_teal.fnt';
const smallfontTealUrl = 'data/font/georgia_26_teal.fnt';
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
	borderTop: [36, 178],
	borderBot: [208, 440],
	name: [50, 721],
	avatar: [37, 179],
	job1: [],
	job2: [],
	job3: [],
	slash: [475, 237],
	pierce: [596, 237],
	strike: [717, 237],
	missile: [838, 237],
	magic: [959, 237],
	fire: [475, 399],
	ice: [596, 399],
	earth: [717, 399],
	wind: [838, 399],
	lightning: [475, 516],
	water: [596, 516],
	light: [717, 516],
	dark: [838, 516],
	poison: [475, 680],
	blind: [596, 680],
	sleep: [717, 680],
	silence: [838, 680],
	paralyze: [959, 680],
	confusion: [475, 800],
	petrify: [596, 800],
	toad: [717, 800],
	charm: [838, 800],
	slow: [959, 800],
	stop: [475, 917],
	immobilize: [596, 917],
	disable: [717, 917],
	berserk: [838, 917],
	doom: [959, 917],
};

module.exports = exports = async function createUnitResImage(name, ref, resistance, job1, job2, job3, rarity, element) {
	try {
		if (fs.existsSync('public/img/char/' + ref + '.png')) {
			return '';
		}
	} catch (err) {
		console.error(err);
	}
	const borderTop = await Jimp.read(`data/img/frame/${rarity}.png`);
	borderTop.rotate(180);
	const borderBot = await Jimp.read(`data/img/frame/${rarity}.png`);
	const elementImage = await Jimp.read(`data/img/element/${element.toLowerCase()}.png`);
	const rarityImage = await Jimp.read(`data/img/rarity/${rarity.toLowerCase()}.png`);
	const baseImage = await Jimp.read(baseImageUrl);
	const fontGreen = await Jimp.loadFont(fontGreenUrl);
	const fontWhite = await Jimp.loadFont(fontWhiteUrl);
	const fontRed = await Jimp.loadFont(fontRedUrl);
	const fontTeal = await Jimp.loadFont(fontTealUrl);
	const smallfontTeal = await Jimp.loadFont(smallfontTealUrl);
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
	avatar.autocrop(0.2);
	let textImage = await Jimp.read('data/img/transparent.png');
	let keys = Object.entries(resistance);
	if (keys[0][0] == '$init') keys.splice(0, 1);
	for (const [key, value] of keys) {
		console.log(`${key}: ${value}`);
		let number = value + '%';
		let offsetX = 0;
		try {
			if (value > 0) {
				if (value >= 100) {
					offsetX = 5;
					number = 'Imm.';
				}

				textImage.composite(arrowUp, coords[key][0] + 38, coords[key][1] - 60);
				textImage.print(fontGreen, coords[key][0] - offsetX, coords[key][1], number);
			} else if (value < 0) {
				textImage.composite(arrowDown, coords[key][0] + 38, coords[key][1] - 60);
				textImage.print(fontRed, coords[key][0], coords[key][1], number);
			} else {
				textImage.print(fontWhite, coords[key][0] + 27, coords[key][1], '--');
			}
		} catch (err) {
			console.log(err);
		}
	}

	textImage.print(
		// fontTeal,
		fontTeal,
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
	// start of box is x = 34, y = 777,  width = 356, height = 67
	// element is 58x58
	let rarityDim = {};
	rarityDim.width = rarityImage.bitmap.width;
	rarityDim.height = rarityImage.bitmap.height;
	baseImage.composite(rarityImage, 34 + (356 - rarityDim.width + 58 + 30) / 2, 777 + (67 - rarityDim.height) / 2);
	baseImage.composite(elementImage, 34 + (356 - (rarityDim.width + 58 + 30)) / 2, 777 + (67 - 58) / 2);
	baseImage.composite(avatar, coords.avatar[0] + leftGap, coords.avatar[1] + topGap);
	baseImage.composite(borderTop, coords.borderTop[0], coords.borderTop[1]);
	baseImage.composite(borderBot, coords.borderBot[0], coords.borderBot[1]);
	baseImage.composite(textImage, 0, 0, { mode: Jimp.BLEND_SOURCE_OVER, opacityDest: 1, opacitySource: 1 });

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
