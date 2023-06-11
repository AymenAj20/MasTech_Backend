const express = require ('express')
const router = express.Router()
const chantierController = require('../Controllers/chantierController')
const {setRole,verifyToken} = require('../Controllers/authController')


router.get('/',setRole('Admin'),verifyToken,chantierController.findAll)
router.get('/:id',setRole('Admin','chefProjet'),verifyToken,chantierController.findById)
router.get('/:id/etages',setRole('Admin','chefProjet'),verifyToken,chantierController.findEtages)
router.get('/:id/etages/:etageId',setRole('Admin','chefProjet'),verifyToken,chantierController.getEtageById)
router.get('/:id/taches',setRole('chefProjet','chefChantier'),verifyToken,chantierController.getTasks) // Retournr touts les taches de ce chantier
router.put('/:id/cloturer',setRole('chefProjet'),verifyToken,chantierController.changerEtatChantier)
//router.post('/',setRole('Admin'),verifyToken,chantierController.addChantier)
//router.put('/:id',setRole('Admin'),verifyToken,chantierController.updateChantier)
//router.put('/:id/etages/:etageId',setRole('Admin'),verifyToken,chantierController.affecterEtage) 

module.exports = router