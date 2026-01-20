const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  optionsSuccessStatus: 200,
  credentials: true,
}

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

// Routes
app.get('', (req, res) => { return res.send('SoporteUAC API') });
app.use('/auth', require('./routes/auth.routes'));
app.use('/users', require('./routes/user.routes'));

module.exports = app;