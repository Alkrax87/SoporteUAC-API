const express = require('express');
const app = express();
const morgan = require('morgan');
require('dotenv').config();

// Middleware
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('', (req, res) => { return res.send('SoporteUAC API') });
app.use('/users', require('./routes/user.routes'));

module.exports = app;