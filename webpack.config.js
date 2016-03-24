
/********************************************************************************
 * WEBPACK CONFIG
 ********************************************************************************
 */

var path = require('path');
var webpack = require('webpack');

var webpackConfig = {

  watch: true,

  bail: true,

  context: path.resolve('./ui'),

  entry: {
    core: './modules/core/core.module.js',
    home: './modules/home/home.module.js',
    vote: './modules/vote/vote.module.js',
  },
  
  output: {
    filename: '[name].bundle.js',
    path: path.resolve('./dist')
  },

  module: {
    loaders: [
      {
        exclude: [
          /node_modules/
        ],
        loader: 'babel',
        test: /\.js$/,
        query: {
          presets: ["es2015", "stage-0", "angular"]
        }
      }
    ]
  },

  externals: {
    'angular': 'angular'
  },

};

module.exports = webpackConfig;