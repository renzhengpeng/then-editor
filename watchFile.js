const fs = require('fs');
let cp = require('child_process');
const webpack = require('webpack');
const config = require('./webpack.config');

function watcherCallback(eventType, filename) {
  let compiling = false;
  if (eventType === 'change' && filename.indexOf('___jb_tmp___') === -1 && filename.indexOf('___jb_old___') === -1 && (filename.indexOf('.js') !== -1 || filename.indexOf('.scss') !== -1 || filename.indexOf('.html') !== -1)) {
    if (!compiling) {
      compiling = true;
      webpack(config, (err, stats) => {
        if (err) throw err;
        process.stdout.write(stats.toString({
          colors: true,
          modules: false,
          children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
          chunks: false,
          chunkModules: false
        }) + '\n\n');
        compiling = false;
      });
    }
  }
}
const watcher1 = fs.watch('./src', {
  recursive: true
}, watcherCallback);
