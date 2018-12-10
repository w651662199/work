var utils = require('./utils')
var webpack = require('webpack')
var glob = require('glob')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
console.log(JSON.stringify(config.dev.env))
// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})
module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(config.dev.env)
      }
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    /*new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),*/
    new FriendlyErrorsPlugin()
  ]
})

var pages = getEntry('./src/components/source/**/*.html');

for (var pathname in pages) {
  //console.log('./src/components/source/' + pathname + '/' + 'index.html')
  // 配置生成的 html 文件，定义路径等
  if(pathname == 'app'){
    var conf = {
      // html 文件输出路径
      //filename: prod? '../Application/Home/View/' + pathname + '.html' : pathname + '.html',
      filename: 'index.html',
      template: 'index.html', // 模板路径
      inject: true,              // js 插入位置
      minify: {
        removeComments: true,
        collapseWhitespace: false
      }
    };
  }else{
    var conf = {
      // html 文件输出路径
      //filename: prod? '../Application/Home/View/' + pathname + '.html' : pathname + '.html',
      filename: pathname + '.html',
      template: './src/components/source/' + pathname + '/' +'index.html', // 模板路径
      inject: true,              // js 插入位置
      minify: {
        removeComments: true,
        collapseWhitespace: false
      }
    };
  }
  if (pathname in module.exports.entry) {
    conf.chunks = ['vendors', pathname];
    conf.hash = false;
  }
  //console.log(conf);
  // 需要生成几个 html 文件，就配置几个 HtmlWebpackPlugin 对象
  module.exports.plugins.push(new HtmlWebpackPlugin(conf));
}

function getEntry(globPath) {
  var entries = {},
    basename, tmp, pathname;
  glob.sync(globPath).forEach(function (entry) {
    /*basename = path.basename(entry, path.extname(entry));
    tmp = entry.split('/').splice(-3);
    pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出 js 和 html 的路径
    entries[pathname] = entry;*/

    tmp = entry.split('/').splice(-3);
    //console.log(entry.split('/')[4]);
    pathname = entry.split('/')[4];
    entry = './src/components/source/' + pathname + '/' + 'index.html';
    //pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出 js 和 html 的路径

    entries[pathname] = entry;
    //console.log(entries);
  });
  entries['app'] = 'index.html';
  //console.log(entries)
  return entries;
}
