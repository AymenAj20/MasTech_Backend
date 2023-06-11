const express = require ('express')
const router = express.Router()
const authController = require('../Controllers/authController')

router.post('/login', authController.login);
//router.post('/forgotPassword', forgotPassword);
//router.post('/verifyResetCode', verifyPassResetCode);
//router.put('/resetPassword', resetPassword);

module.exports = router