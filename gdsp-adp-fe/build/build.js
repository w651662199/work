// https://github.com/shelljs/shelljs
require('./check-versions')();
require('shelljs/global');

var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');
const {
	js_beautify
} = require('js-beautify');
const {
	exec,
	execSync
} = require('child_process');
var config = require('../config');
var ora = require('ora');
var webpack = require('webpack');
var webpackConfig = require('./webpack.prod.conf');
var env = require('../config/env.config');

var assetsRoot = config.build.assetsRoot;
var assetsSubDirectory = config.build.assetsSubDirectory;
if (env === 'bDev') {
	assetsRoot = config.bDev.assetsRoot;
	assetsSubDirectory = config.bDev.assetsSubDirectory;
} else if (env === 'pre') {
	assetsRoot = config.pre.assetsRoot;
	assetsSubDirectory = config.pre.assetsSubDirectory;
}

console.log(
	'  Tip:\n' +
	'  Built files are meant to be served over an HTTP server.\n' +
	'  Opening index.html over file:// won\'t work.\n'
);

var spinner = ora('');

var assetsPath = path.join(assetsRoot, assetsSubDirectory);
// rm('-rf', assetsPath);
mkdir('-p', assetsPath);
// cp('-R', 'static/*', assetsPath);
// cp('-R', 'src/assets/css/theme/*', path.join(__dirname, '../node_modules/'));

function execPromise(cmd) {
	return new Promise((resolve, reject) => {
		exec(cmd, (err, stdout, stderr) => {
			if (err) return reject(err);
			resolve(stdout);
		});
	});
}

function checkSt() {
	return new Promise((resolve, reject) => {
		exec('git status -s', (err, stdout, stderr) => {
			if (err) return reject(err);
			return resolve(!!stdout);
		});
	});
}

function webpackGo(cb) {
	spinner.stop();
	spinner.text = `building for ${config.build.env}`;
	spinner.start();
	webpack(webpackConfig, function(err, stats) {
		if (err) throw err;
		spinner.stop();
		process.stdout.write(stats.toString({
			colors: true,
			modules: false,
			children: false,
			chunks: false,
			chunkModules: false
		}) + '\n');
		if (cb) cb();
	});
}

function uploadStaticFiles() {
	if (config.build.env === 'production') return;
	exec('python deploy.py -a', function(err, stdout, stderr) {
		console.log('stdout: ' + stdout);
		if (err) {
			console.log('err: ' + err);
		}
		if (stderr) {
			console.log('stderr: ' + stderr);
		}
	})
}

webpackGo(uploadStaticFiles);