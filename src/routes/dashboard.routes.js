const express = require('express');
const router = express.Router();
const { getDashboard, getDataForExcel } = require('../controllers/dashboard.controller');

router.get('', getDashboard);
router.get('/excel/:month', getDataForExcel);

module.exports = router;