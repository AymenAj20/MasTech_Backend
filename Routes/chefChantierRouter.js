const express = require ('express')
const router = express.Router()
const chefChantierController = require('../Controllers/chefChantierController')

router.get('/',chefChantierController.findAll)
router.get('/:id',chefChantierController.findById)
router.get('/:id/taches',chefChantierController.findAllTasks)// Retourne touts les taches
router.get('/:id/chantiers',chefChantierController.findChantiers)// Retourne touts les chantiers
router.get('/:id/chantier/:chantierId/taches',chefChantierController.findChantierTasks)// Retourne touts les taches pour un chantier donné
router.get('/:id/tachesToDo',chefChantierController.findToDoTasks)//Retourne les taches non terminées 
router.post('/',chefChantierController.addChefChantier)
router.put('/:id',chefChantierController.updateChefChantier)
router.delete('/:id',chefChantierController.deleteChefChantier) // Supprime un ChefChantier



module.exports = router 