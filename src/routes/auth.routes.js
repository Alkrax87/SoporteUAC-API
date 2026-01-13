const express = require('express');
const { login, resetPassword } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/login', login);
router.post('/reset-password/:id', resetPassword);

module.exports = router;