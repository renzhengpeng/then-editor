require('./watchFile');
const express = require('express');
const opn = require('opn');
const app = express();
const path = require('path');
const PORT = 8888;

function startServer() {
  app.use('/dist/js', express.static('dist/js'));
  app.use('/dist/css', express.static('dist/css'));
  app.use('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './example.html'));
  });
  app.listen(PORT, () => {
    console.log('listen at:' + PORT);
    opn('http://localhost:' + PORT);
  });
}

startServer();
