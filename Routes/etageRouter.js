const express = require ('express')
const router = express.Router()
const etageController = require('../Controllers/etageController')
const {setRole,verifyToken} = require('../Controllers/authController')

router.get('/',setRole('Admin'),verifyToken,etageController.findAll)
router.get('/:id',setRole('Admin','chefProjet','chefChantier'),verifyToken,etageController.findById)
router.get('/:id/elements',etageController.findElements) // Retourne liste des elements
router.get('/:id/elements/:elementId',etageController.getElementById)
router.get('/:id/plan',setRole('Admin','chefProjet','chefChantier'),verifyToken,etageController.getPlan)// Retourne un Plan
//router.post('/',setRole('Admin'),verifyToken,etageController.addEtage)
//router.put('/:id',etageController.updateEtage)
router.put('/:id/elements/:elementId',setRole('chefProjet'),verifyToken,etageController.affecterElement) 
router.put('/:id/plans/:planId',setRole('chefProjet'),verifyToken,etageController.affecterPlan) 

module.exports = router