require('./watchFile');
const express = require('express');
const opn = require('opn');
const app = express();
const path = require('path');
const PORT = 8888;
const webpack = require('webpack');
const config = require('./webpack.config');

function startServer() {
  app.use('/dist/js', express.static('dist/js'));
  app.use('/dist/css', express.static('dist/css'));
  // app.use('/font', express.static('dist/font'));
  app.use('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './example.html'));
  });
  app.listen(PORT, () => {
    console.log('listen at:' + PORT);
    opn('http://localhost:' + PORT);
  });
}
function build(callback) {
  webpack(config, (err, stats) => {
    if (err) throw err;
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n');
    callback();
  });
}

build(startServer);
