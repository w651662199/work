var path = require('path');
var config = require('../config');
var utils = require('./utils');
var projectRoot = path.resolve(__dirname, '../');

var env = require('../config/env.config.js');
var cssSourceMapDev = ((env === 'dev' || env === 'test') && config.dev.cssSourceMap);
var cssSourceMapProd = (env === 'production' && config.build.productionSourceMap);
var useCssSourceMap = cssSourceMapDev || cssSourceMapProd;

module.exports = {
	entry: {
		app: './src/app.js'
	},
	output: {
		path: config.build.assetsRoot,
		publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPath : config.dev.assetsPath,
		filename: '[name].js'
	},
	resolve: {
		extensions: ['', '.js', '.vue', '.json'],
		fallback: [path.join(__dirname, '../node_modules')],
		alias: {
			'vue$': 'vue/dist/vue.common.js',
			help: path.join(__dirname, '../src/help'),
			utils: path.join(__dirname, '../src/utils'),
			http: path.join(__dirname, '../src/utils/http.js'),
			event: path.join(__dirname, '../src/utils/event.js'),
			store: path.join(__dirname, '../src/vuex/index.js'),
			actions: path.join(__dirname, '../src/vuex/actions/index.js')
		}
	},
	resolveLoader: {
		fallback: [path.join(__dirname, '../node_modules')]
	},
	module: {
		preLoaders: [{
			test: /\.vue$/,
			loader: 'eslint',
			include: projectRoot,
			exclude: /node_modules/
		}, {
			test: /\.js$/,
			loader: 'eslint',
			include: projectRoot,
			exclude: /node_modules/
		}],
		loaders: [{
			test: /\.vue$/,
			loader: 'vue'
		}, {
			test: /\.js$/,
			loader: 'babel',
			include: projectRoot,
			exclude: /node_modules/
		}, {
			test: /\.json$/,
			loader: 'json'
		}, {
			test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
			loader: 'url',
			query: {
				limit: 50000,
				name: utils.assetsPath('img/[name].[hash:7].[ext]')
			}
		}, {
			test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
			loader: 'url',
			query: {
				limit: 50000,
				name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
			}
		}]
	},
	eslint: {
		formatter: require('eslint-friendly-formatter')
	},
	vue: {
		loaders: utils.cssLoaders({
			sourceMap: useCssSourceMap
		}),
		postcss: [
			require('autoprefixer')({
				browsers: ['last 2 versions']
			})
		]
	}
};