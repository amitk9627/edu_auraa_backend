const express = require('express');
const router = express.Router();

const { addUpdateInstitute, getInstitute, deleteInstitute } = require('../controller/institute');

router.post('/addUpdateInstitute', addUpdateInstitute);
router.get('/getInstitute/:data', getInstitute);             
router.delete('/deleteInstitute/:id', deleteInstitute);  

module.exports = router;
