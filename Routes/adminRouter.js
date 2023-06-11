const express = require ('express')
const router = express.Router()
const adminController = require('../Controllers/adminController')
const imageUpload = require('../helpers/imageUpload')
const uploadOptions = imageUpload.uploadOptions

router.get('/',adminController.findAll)
router.get('/:id',adminController.findUserById) 
router.post('/:id',uploadOptions.single('image'),adminController.register)
router.put('/:id',uploadOptions.single('image'),adminController.updateUser)
router.delete('/:id',adminController.deleteUser)

module.exports = router