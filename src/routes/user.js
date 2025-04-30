const express = require('express');
const router = express.Router();

const { createUser, loginViaEmail, verifyOtpViaEmail } = require('../controller/user');

router.post('/createUser', createUser);
router.post('/loginViaEmail', loginViaEmail);             
router.post('/verifyOtpViaEmail', verifyOtpViaEmail);  

module.exports = router;
