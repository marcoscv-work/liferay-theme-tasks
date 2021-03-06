'use strict';

var glob = require('glob');
var path = require('path');
var plugins = require('gulp-load-plugins')();
var versionControl = require('./lib/version_control.js');

module.exports.registerTasks = function(options) {
	options = require('./lib/options')(options);

	var gulp = options.gulp;

	plugins.storage(gulp);

	var store = gulp.storage;

	store.create('LiferayTheme', 'liferay-theme.json');

	glob.sync(path.resolve(__dirname, 'tasks/**/*')).forEach(function(item, index) {
		require(item)(options);
	});

	process.once('beforeExit', function() {
		versionControl();
	});
};