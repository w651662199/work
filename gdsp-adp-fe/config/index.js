var path = require('path');
var env = require('./env.config.js');

module.exports = {
	build: {
		env: env,
		index: path.resolve(__dirname, '../../gdsp-adp/src/main/resources/templates/production/index.html'),
		assetsRoot: path.resolve(__dirname, '../../gdsp-adp/src/main/resources'),
		assetsSubDirectory: 'static',
		assetsPublicPath: '/',
		assetsPath: '/',
		productionSourceMap: false,
		productionGzip: false,
		productionGzipExtensions: ['js', 'css']
	},
	dev: {
		env: env,
		port: 5662,
		assetsSubDirectory: 'static',
		assetsPublicPath: '/',
		assetsPath: '/',
		proxyTable: {},
		cssSourceMap: false
	},
	bDev: {
		env: env,
		index: path.resolve(__dirname, '../../gdsp-adp/src/main/resources/templates/development/index.html'),
		assetsRoot: path.resolve(__dirname, '../dist'),
		assetsSubDirectory: '/',
		assetsPublicPath: 'http://10.112.178.90:8000/m/ADP/dist/',
		assetsPath: '/',
		productionSourceMap: false,
		productionGzip: false,
		productionGzipExtensions: ['js', 'css']
	},
	pre: {
		env: env,
		index: path.resolve(__dirname, '../../gdsp-adp/src/main/resources/templates/preproduction/index.html'),
		assetsRoot: path.resolve(__dirname, '../dist'),
		assetsSubDirectory: '/',
		assetsPublicPath: 'http://10.112.178.90:8000/m/ADP/dist/',
		assetsPath: '/',
		productionSourceMap: false,
		productionGzip: false,
		productionGzipExtensions: ['js', 'css']
	},
	staging: {
		env: env,
		index: path.resolve(__dirname, '../../gdsp-adp/src/main/resources/templates/staging/index.html'),
		assetsRoot: path.resolve(__dirname, '../dist'),
		assetsSubDirectory: '/',
		assetsPublicPath: 'http://10.112.178.90:8000/m/ADP/dist/',
		assetsPath: '/',
		productionSourceMap: false,
		productionGzip: false,
		productionGzipExtensions: ['js', 'css']
	}
};