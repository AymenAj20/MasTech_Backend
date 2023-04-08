const express = require ('express')
const router = express.Router()
const chefProjetController = require('../Controllers/chefProjetController')

router.get('/',chefProjetController.findAll) // Retourne liste de tous les Chef Projet
router.get('/:id',chefProjetController.findChefById) // Retourne un ChefProjet par ID
router.get('/:id/chantiers',chefProjetController.findChantiers) // Retourne liste des chantiers d'un chefProjet 
router.get('/:id/chantiers/:chantierId',chefProjetController.getChantierById) // Retourne un projet de chefProjet par son ID 
router.post('/',chefProjetController.addchefProject) // Ajoute un chef de projet 
router.put('/:id',chefProjetController.updateChefProjet) // Modifier un ChefProjet 
router.put('/:id/chantiers/:chantierId',chefProjetController.affecterChantier) // Affecter un projet a un ChefProjet
router.delete('/:id',chefProjetController.deleteChefProjet) // Supprime un ChefProjet

module.exports = router