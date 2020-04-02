const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

let env = process.argv[2].split('=')[1];
module.exports = {
  mode: env || 'development',
  entry: {
    BdfintEditor: './index.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/[name].min.js',
    publicPath: '/',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js/,
        loader: 'babel-loader'
      }, {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]'
        }
      }, {
        test: /\.(woff2?|eot|ttf|otf)$/,
        loader: 'url-loader',
        options: {}
      }, {
        test: /\.scss/,
        use: ExtractTextPlugin.extract({
          use:['css-loader', 'sass-loader']
        })
      }
    ]
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    new ExtractTextPlugin({
      filename: 'css/[name].min.css'
    })
  ]
};
