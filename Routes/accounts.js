const express = require ('express')
const router = express.Router()
const accountsController = require('../Controllers/accountsController')
const {setRole,verifyToken} = require('../Controllers/authController')
const imageUpload = require('../helpers/imageUpload')
const uploadOptions = imageUpload.uploadOptions

router.put('/:id',setRole('Admin','chefProjet','chefChantier'),verifyToken,uploadOptions.single('image'), accountsController.updateAccount);
module.exports = router