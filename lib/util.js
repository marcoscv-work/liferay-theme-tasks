'use strict';

var _ = require('lodash');
var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs-extra');
var path = require('path');

var fullDeploy = (argv.full || argv.f);

module.exports = {
	getLanguageProperties: function() {
		var pathContent = path.join('./build', 'WEB-INF/src/content');

		var languageKeys = [];

		if (fs.existsSync(pathContent) && fs.statSync(pathContent).isDirectory()) {
			var contentFiles = fs.readdirSync(pathContent);

			_.forEach(
				contentFiles,
				function(item, index) {
					if (item.match(/Language.*properties/)) {
						var xmlElement = '<language-properties>content/' + item + '</language-properties>';

						languageKeys.push(xmlElement);
					}
				}
			);
		}

		return languageKeys;
	},

	getSrcPath: function(srcPath, config, validator) {
		if (_.isUndefined(config)) {
			config = {};
		}

		var changedFile = config.changedFile;

		var changed = (changedFile && (changedFile.type == 'changed'));

		var fastDeploy = (!fullDeploy && config.deployed);

		if (changed && fastDeploy) {
			var changedFileName = path.basename(changedFile.path);

			if (validator && !validator(changedFileName)) {
				return srcPath;
			}

			srcPath = path.join(srcPath, '..', changedFileName);
		}

		return srcPath;
	},

	isCssFile: function(name) {
		return name.indexOf('.css') > -1;
	}
};