const express = require('express');
const { getPendientes, addPendiente, updatePendiente, deletePendiente } = require('../controllers/pendiente.controller');
const router = express.Router();

router.get('', getPendientes);
router.post('', addPendiente);
router.put('/:id', updatePendiente);
router.delete('/:id', deletePendiente);

module.exports = router;