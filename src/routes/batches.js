const express = require('express');
const router = express.Router();

const { addUpdateBatch, getBatch, deleteBatch } = require('../controller/batches');

router.post('/addUpdateBatch', addUpdateBatch);
router.get('/getBatch/:instituteId', getBatch);             
router.delete('/deleteBatch/:id', deleteBatch);  

module.exports = router;
