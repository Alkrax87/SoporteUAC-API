const express = require('express');
const { getReportes, addReporte, updateReporte, deleteReporte } = require('../controllers/reporte.controller');
const router = express.Router();

router.get('', getReportes);
router.post('', addReporte);
router.put('/:id', updateReporte);
router.delete('/:id', deleteReporte);

module.exports = router;
