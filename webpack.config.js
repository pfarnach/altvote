
/********************************************************************************
 * WEBPACK CONFIG
 ********************************************************************************
 */

var path = require('path');
var webpack = require('webpack');

var webpackConfig = {

  bail: true,

  context: path.resolve('./ui'),

  entry: {
    core: './modules/core/core.module.js',
    home: './modules/home/home.module.js',
    vote: './modules/vote/vote.module.js',
  },
  
  externals: {
    'angular': 'angular'
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

  output: {
    filename: '[name].bundle.js',
    path: path.resolve('./ui/dist')
  }

};

module.exports = webpackConfig;