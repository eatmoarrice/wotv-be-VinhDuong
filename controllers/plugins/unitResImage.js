const Jimp = require('jimp');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const { text } = require('express');
const cloudinary = require('cloudinary');
const baseImageUrl = 'data/baseImages/res.png';
const fontGreenUrl = 'data/font/georgia_32_green.fnt';
const fontWhiteUrl = 'data/font/georgia_32_white.fnt';
const fontRedUrl = 'data/font/georgia_32_red.fnt';
const fontTealUrl = 'data/font/georgia_28_grad2.fnt';
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
const boxWidth = 106;
const boxDistance = 9;
const row = [170, 295, 372, 493, 568, 653];
const col = [];
const baseCol = 450;
for (let i = 0; i < 5; i++) {
	col.push((+boxWidth + boxDistance) * (i + 1) - boxWidth - boxDistance + baseCol);
}

console.log(col);

const coords = {
	borderTop: [50, 85],
	borderBot: [173, 235],
	name: [54, 425],
	avatar: [48, 91],
	job1: [],
	job2: [],
	job3: [],
	slash: [col[0], row[0]],
	pierce: [col[1], row[0]],
	strike: [col[2], row[0]],
	missile: [col[3], row[0]],
	magic: [col[4], row[0]],
	fire: [col[0], row[1]],
	ice: [col[1], row[1]],
	earth: [col[2], row[1]],
	wind: [col[3], row[1]],
	lightning: [col[0], row[2]],
	water: [col[1], row[2]],
	light: [col[2], row[2]],
	dark: [col[3], row[2]],
	poison: [col[0], row[3]],
	blind: [col[1], row[3]],
	sleep: [col[2], row[3]],
	silence: [col[3], row[3]],
	paralyze: [col[4], row[3]],
	confusion: [col[0], row[4]],
	petrify: [col[1], row[4]],
	toad: [col[2], row[4]],
	charm: [col[3], row[4]],
	slow: [col[4], row[4]],
	stop: [col[0], row[5]],
	immobilize: [col[1], row[5]],
	disable: [col[2], row[5]],
	berserk: [col[3], row[5]],
	doom: [col[4], row[5]],
};
console.log(coords);
module.exports = exports = async function createUnitResImage({ name, ref, res, job1, job2, job3, rarity, element }, willReplace) {
	try {
		if (fs.existsSync('public/img/char/' + ref + '.png') && willReplace) {
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
		j1 = await Jimp.read(`data/img/mainjob/${job1}.png`);
	} catch (err) {
		j1 = await Jimp.read(`data/img/mainjob/unknown.png`);
	}

	try {
		j2 = await Jimp.read(`data/img/subjob/${job2}.png`);
	} catch (err) {
		j2 = await Jimp.read(`data/img/subjob/unknown.png`);
	}

	try {
		j3 = await Jimp.read(`data/img/subjob/${job3}.png`);
	} catch (err) {
		j3 = await Jimp.read(`data/img/subjob/unknown.png`);
	}

	arrowUp.resize(Jimp.AUTO, 40);
	arrowDown.resize(Jimp.AUTO, 40);
	const avatar = await Jimp.read(`data/source/${ref}_m.png`);
	// avatar.autocrop(0.2);
	avatar.resize(Jimp.AUTO, 240);
	let textImage = await Jimp.read('data/img/transparent.png');
	let keys = Object.entries(res);
	if (keys[0][0] == '$init') keys.splice(0, 1);
	for (const [key, value] of keys) {
		console.log(`${key}: ${value}`);
		let number = value + '%';

		try {
			if (value > 0) {
				if (value >= 100) {
					number = 'Null';
				}

				textImage.composite(arrowUp, coords[key][0] + 70, coords[key][1] - 30);
				textImage.print(
					fontGreen,
					coords[key][0],
					coords[key][1],
					{
						text: number,
						alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
					},
					boxWidth,
					0
				);
			} else if (value < 0) {
				textImage.composite(arrowDown, coords[key][0] + 70, coords[key][1] - 30);
				textImage.print(
					fontRed,
					coords[key][0],
					coords[key][1],
					{
						text: number,
						alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
					},
					boxWidth,
					0
				);
			} else {
				textImage.print(
					fontWhite,
					coords[key][0],
					coords[key][1],
					{
						text: `--`,
						alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
					},
					boxWidth,
					0
				);
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
		282,
		0
	);
	let avatarDim = {};
	avatarDim.width = avatar.bitmap.width;
	avatarDim.height = avatar.bitmap.height;
	let leftGap = (304 - avatarDim.width) / 2;
	let topGap = (327 - avatarDim.height) / 2;
	baseImage.composite(j1, 57, 486);
	baseImage.composite(j2, 157, 486);
	baseImage.composite(j3, 257, 486);
	// start of box is x = 36, y = 602,  width = 330, height = 68
	// element is 58x58
	let rarityDim = {};
	rarityDim.width = rarityImage.bitmap.width;
	rarityDim.height = rarityImage.bitmap.height;
	baseImage.composite(rarityImage, 36 + (330 - rarityDim.width + 58 + 30) / 2, 602 + (68 - rarityDim.height) / 2);
	baseImage.composite(elementImage, 36 + (330 - (rarityDim.width + 58 + 30)) / 2, 602 + (68 - 58) / 2);
	baseImage.composite(avatar, coords.avatar[0] + leftGap, coords.avatar[1] + topGap);
	// baseImage.composite(borderTop, coords.borderTop[0], coords.borderTop[1]);
	// baseImage.composite(borderBot, coords.borderBot[0], coords.borderBot[1]);
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
