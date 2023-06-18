const express = require ('express')
const router = express.Router()
const chefProjetController = require('../Controllers/chefProjetController')
const rapportController = require('../Controllers/rapportController')
const {setRole,verifyToken} = require('../Controllers/authController')
const imageUpload = require('../helpers/imageUpload')


const uploadOptions = imageUpload.uploadOptions 


router.get('/',setRole('Admin'),verifyToken,chefProjetController.findAll) // Retourne liste de tous les Chef Projet
router.get('/:id/generate-rapport/:idChantier',setRole('chefProjet'),verifyToken,rapportController.generateRapport) // Genere et retourne un rapport
router.get('/:id',setRole('Admin','chefProjet'),verifyToken,chefProjetController.findChefById) // Retourne un ChefProjet par ID
router.get('/:id/chantiers',setRole('Admin','chefProjet'),verifyToken,chefProjetController.findChantiers) // Retourne liste des chantiers d'un chefProjet 
router.get('/:id/chantiers/:chantierId',setRole('Admin','chefProjet'),verifyToken,chefProjetController.getChantierById) // Retourne un chantier de chefProjet par son ID 
router.put('/:id/chantiers/:chantierId',setRole('Admin'),verifyToken,chefProjetController.affecterChantier,chefProjetController.getChantierById) // Affecter un chantier a un ChefProjet
router.delete('/:id',setRole('Admin'),verifyToken,chefProjetController.deleteChefProjet,chefProjetController.getChantierById) // Supprime un ChefProjet
router.post('/register',setRole('Admin'),verifyToken,chefProjetController.addChefProjet,chefProjetController.getChantierById) //Ajouter un chefProjet

module.exports = router