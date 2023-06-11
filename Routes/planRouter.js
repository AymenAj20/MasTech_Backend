const express = require('express')
const router = express.Router()
const planController = require('../Controllers/planController')
const imageUpload = require('../helpers/imageUpload')
const uploadOptions = imageUpload.uploadOptions
const {setRole,verifyToken} = require('../Controllers/authController')

router.get('/',setRole('Admin'),verifyToken,planController.findAll)
router.get('/:id', setRole('Admin','chefProjet','chefChantier'),verifyToken, planController.findPlanById)
router.post('/',setRole('chefProjet'),verifyToken,uploadOptions.single('image'),planController.addPlan)
router.delete('/:id',setRole('chefProjet'),verifyToken, planController.deletePlan)


 






module.exports = router