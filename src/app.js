const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

app.get('', (req, res) => {
  return res.send('Hello Wold');
});

module.exports = app;