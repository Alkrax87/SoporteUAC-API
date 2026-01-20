const express = require('express');
const { login, logout, resetPassword, checkAuth } = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/login', login);
router.get('/logout', logout);
router.post('/reset-password/:id', resetPassword);
router.get('/check-auth', requireAuth, checkAuth);

module.exports = router;