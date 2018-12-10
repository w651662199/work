var path = require('path');
var env = require('./env.config.js');

module.exports = {
	build: {
		env: env,
		index: path.resolve(__dirname, '../dist/index.html'),
		assetsRoot: path.resolve(__dirname, '../dist'),
		assetsSubDirectory: 'static',
		assetsPublicPath: 'https://js.meixincdn.com/m/AMP/dist/',
		assetsPath: '/',
		productionSourceMap: false,
		productionGzip: false,
		productionGzipExtensions: ['js', 'css']
	},
	dev: {
		env: env,
		port: 5657,
		assetsSubDirectory: 'static',
		assetsPublicPath: '/',
		assetsPath: '/',
		proxyTable: {},
		cssSourceMap: false
	},
	pre: {
		env: env,
		index: path.resolve(__dirname, '../dist/index.html'),
		assetsRoot: path.resolve(__dirname, '../dist'),
		assetsSubDirectory: 'static',
		assetsPublicPath: 'http://10.112.178.90:8000/m/AMP/dist/',
		assetsPath: '/',
		productionSourceMap: false,
		productionGzip: false,
		productionGzipExtensions: ['js', 'css']
	}
};
