const express = require ('express')
const router = express.Router()
const chefChantierController = require('../Controllers/chefChantierController')
const {setRole,verifyToken} = require('../Controllers/authController')

router.get('/',setRole('Admin','chefProjet'),verifyToken,chefChantierController.findAll)
router.get('/:id',setRole('Admin','chefChantier'),verifyToken,chefChantierController.findById)
router.get('/:id/taches',setRole('chefChantier'),verifyToken,chefChantierController.findAllTasks)// Retourne touts les taches
router.get('/:id/chantiers',setRole('chefChantier'),verifyToken,chefChantierController.findChantiers)// Retourne touts les chantiers
router.get('/:id/chantier/:chantierId/taches',setRole('chefChantier'),verifyToken,chefChantierController.findChantierTasks)// Retourne touts les taches pour un chantier donné
router.get('/:id/chantier/:chantierId/taches',chefChantierController.findChantierTasks)// Retourne touts les taches pour un chantier donné
router.post('/register',setRole('Admin'),verifyToken,chefChantierController.addChefChantier) //Ajouter un chefChantier
router.put('/:id',setRole('Admin'),verifyToken,chefChantierController.updateChefChantier)
router.delete('/:id',setRole('Admin'),verifyToken,chefChantierController.deleteChefChantier) // Supprime un ChefChantier



module.exports = router 