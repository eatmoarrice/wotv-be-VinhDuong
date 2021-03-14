const Jimp = require('jimp');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const { text } = require('express');
const cloudinary = require('cloudinary');
const baseImageUrl = 'data/baseImages/stats2.png';
const fontGreenUrl = 'data/font/georgia_32_green.fnt';
const fontWhiteUrl = 'data/font/pt_serif_30.fnt';
const fontWhiteSmallUrl = 'data/font/pt_serif_26.fnt';
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
const boxHeight = 46;
const boxWidth = 174;
const boxDistance = 10;
const masterWidth = 500;
const row = [];
const col = [554, 844];
const baseRow = 111;
for (let i = 0; i < 8; i++) {
	row.push((+boxHeight + boxDistance) * (i + 1) - boxHeight - boxDistance + baseRow);
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
	hp: [col[0], row[0]],
	ap: [col[0], row[1]],
	tp: [col[1], row[1]],
	move: [col[0], row[2]],
	jump: [col[1], row[2]],
	atk: [col[0], row[3]],
	mag: [col[1], row[3]],
	def: [col[0], row[4]],
	spr: [col[1], row[4]],
	agi: [col[0], row[5]],
	dex: [col[1], row[5]],
	luck: [col[0], row[6]],
	crit: [col[1], row[6]],
	eva: [col[0], row[7]],
	acc: [col[1], row[7]],
	master: [480, 610],
};

module.exports = exports = async function createUnitResImage({ master, name, ref, stats, job1, job2, job3, rarity, element }, willReplace) {
	try {
		if (fs.existsSync('public/img/char/' + ref + '_stats.png') && willReplace) {
			return '';
		}
	} catch (err) {
		console.error(err);
	}
	console.log('ref for ', name, 'is ', ref);
	const borderTop = await Jimp.read(`data/img/frame/${rarity}.png`);
	borderTop.rotate(180);
	const borderBot = await Jimp.read(`data/img/frame/${rarity}.png`);
	const elementImage = await Jimp.read(`data/img/element/${element.toLowerCase()}.png`);
	const rarityImage = await Jimp.read(`data/img/rarity/${rarity.toLowerCase()}.png`);
	const baseImage = await Jimp.read(baseImageUrl);
	const fontGreen = await Jimp.loadFont(fontGreenUrl);
	const fontWhite = await Jimp.loadFont(fontWhiteUrl);
	const fontWhiteSmall = await Jimp.loadFont(fontWhiteSmallUrl);
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
	let keys = Object.entries(stats);
	if (keys[0][0] == '$init') keys.splice(0, 1);
	for (const [key, value] of keys) {
		console.log(`${key}: ${value}`);

		try {
			console.log('key:', key);
			if (key != 'initap' && key != 'cost' && value > 0) {
				textImage.print(
					fontWhite,
					coords[key][0],
					coords[key][1],
					{
						text: key === 'ap' ? `${stats.initap}/${value}` : value.toString(),
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
		fontWhiteSmall,
		coords.master[0],
		coords.master[1],
		{
			text: master,
			alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
		},
		masterWidth,
		0
	);

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

	await baseImage.writeAsync('public/img/char/' + ref + '_stats.png');
	await compressPic('public/img/char/' + ref + '.png', 'public/img/char');
	await cloudinary.v2.uploader.upload('public/img/char/' + ref + '_stats.png', { folder: 'unitStats' }, function (error, result) {
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
