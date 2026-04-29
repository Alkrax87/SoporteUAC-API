const express = require('express');
const router = express.Router();
const { getDashboard, getDataForExcel } = require('../controllers/dashboard.controller');

router.get('', getDashboard);
router.get('/excel/:year/:month', getDataForExcel);

module.exports = router;