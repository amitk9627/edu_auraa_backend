const express = require('express');
const router = express.Router();

const { addUpdateFaculty, getFaculty, deleteFaculty } = require('../controller/faculty');

router.post('/addUpdateFaculty', addUpdateFaculty);
router.get('/getFaculty/:instituteId', getFaculty);             
router.delete('/deleteFaculty/:id', deleteFaculty);  

module.exports = router;
