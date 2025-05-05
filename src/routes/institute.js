const express = require('express');
const router = express.Router();

const { addUpdateInstitute, getInstitute, deleteInstitute,getInstituteById } = require('../controller/institute');

router.post('/addUpdateInstitute', addUpdateInstitute);
router.get('/getInstitute/:data', getInstitute);             
router.delete('/deleteInstitute/:id', deleteInstitute);  
router.get('/getInstituteById/:id', getInstituteById);  

module.exports = router;
