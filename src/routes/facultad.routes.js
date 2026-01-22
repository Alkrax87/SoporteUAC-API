const express = require('express');
const { getFactulades, addFacultad, updateFacultad, deleteFacultad } = require('../controllers/facultad.controller');
const router = express.Router();

router.get('', getFactulades);
router.post('', addFacultad);
router.put('/:id', updateFacultad);
router.delete('/:id', deleteFacultad);

module.exports = router;
