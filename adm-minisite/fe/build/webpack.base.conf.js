var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var glob = require('glob')

var entries = getEntry('./src/components/source/**/*.js')
var chunks = Object.keys(entries)

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: entries,
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.common.js',
			utils: path.join(__dirname, '../src/utils'),
			http: path.join(__dirname, '../src/utils/http.js'),
			event: path.join(__dirname, '../src/utils/event.js'),
			store: path.join(__dirname, '../src/vuex/index.js'),
			actions: path.join(__dirname, '../src/vuex/actions/index.js'),
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 90000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
function getEntry(globPath) {
  var entries = {},
    basename, tmp, pathname;

  glob.sync(globPath).forEach(function (entry) {
    basename = path.basename(entry, path.extname(entry));
    
    /*[ 'avideoDetail', 'index.js' ]
      [ 'itemDetail', 'index.js' ]
      [ 'selectedDetail', 'index.js' ]
      { 'source/index': './src/components/source/shopDetail/index.js',
        app: './src/main.js' }*/
      
    tmp = entry.split('/').splice(-3);
    //console.log(entry.split('/')[4]);
    pathname = entry.split('/')[4];
    entry = './src/components/source/' + pathname + '/' + 'index.js';
    //pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出 js 和 html 的路径

    entries[pathname] = entry;
  });
  entries['app'] = './src/main.js';
  //entries['vendors'] = './app/vendor.js';
  //'vendor.js': './app/vendor.js',
  //entries['vendor'] = './app/vendor.js'; //vendor: './app/vendor.js'
  //console.log(entries);
  return entries;
}
