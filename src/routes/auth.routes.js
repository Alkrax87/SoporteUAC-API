const express = require('express');
const { login, logout, resetPassword } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/login', login);
router.get('/logout', logout);
router.post('/reset-password/:id', resetPassword);

module.exports = router;