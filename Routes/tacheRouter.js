const express = require ('express')
const router = express.Router()
const tacheController = require('../Controllers/tacheController')

router.get('/:id',tacheController.findById)//Retourne une tache par son ID
router.post('/:chefChantierId/:chantierId',tacheController.addTache)//Ajoute une tache et l'affecte a un chantier et chefChantier
router.put('/:id',tacheController.updateTache)//Modifie une tache
router.put('/:id/valider',tacheController.validateTask)//Valider une tache
router.put('/:id/rectifier',tacheController.rectifierTask)//Rectifier une tache
router.put('/:id/terminer',tacheController.terminerTask)//Rectifier une tache

router.delete('/:id',tacheController.deleteTache)//Supprime une tache

 


module.exports = router 