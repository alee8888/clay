const _ = require('lodash');
const clayCSS = require('clay-css');
const countries = require('countries-list').countries;
const fs = require('fs');
const langs = require('languages');
const path = require('path');

const alternateCodes = {
	'in': 'id',
	'iw': 'he',
	'nb': 'no',
};

/**
 *
 * @param {*} data
 * @return {*}
 */
function generateIconData(data) {
	const iconsDoc = _.get(data, 'index.children.docs.children.components.children.icons');

	if (iconsDoc) {
		const iconsPath = path.join(clayCSS.buildDir, 'images', 'icons');

		let files = fs.readdirSync(iconsPath);

		files = _.reject(
			files,
			function(file) {
				return file === 'icons.svg';
			}
		);

		files = _.partition(
			files,
			function(file) {
				return !_.startsWith(file, 'flags-');
			}
		);

		let icons = files[0];
		let flags = files[1];

		icons = icons.map(mapSVG);
		flags = flags.map(mapSVG);

		const flagData = flags.reduce(
			function(prev, item) {
				prev[item] = getLangInfo(item);

				return prev;
			},
			{}
		);

		iconsDoc.icons = icons;
		iconsDoc.flags = flags;
		iconsDoc.flagData = flagData;
	}

	return data;
}

/**
 *
 * @param {*} code
 * @return {*}
 */
function getLangInfo(code) {
	const parts = code.split('-');

	const langCode = parts[0];
	const countryCode = parts[1];

	let lang = langs.getLanguageInfo(alternateCodes[langCode] || langCode).name;

	if (countryCode) {
		const country = countries[countryCode.toUpperCase()];

		if (country) {
			lang += ' (' + country.name + ')';
		}
	}

	return lang;
}

/**
 *
 * @param {*} item
 * @return {*}
 */
function mapSVG(item) {
	let iconName = path.basename(item, '.svg').toLowerCase();

	if (_.startsWith(iconName, 'flags-')) {
		iconName = iconName.replace(/^flags-/, '');
	}

	return iconName;
}

module.exports = generateIconData;