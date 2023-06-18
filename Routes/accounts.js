const express = require ('express')
const router = express.Router()
const accountsController = require('../Controllers/accountsController')
const {setRole,verifyToken} = require('../Controllers/authController')
const imageUpload = require('../helpers/imageUpload')
const uploadOptions = imageUpload.uploadOptions

router.put('/:id',setRole('chefProjet','chefChantier'),verifyToken,uploadOptions.single('image'), accountsController.updateAccount);
router.get('/:id/note',setRole('chefChantier','chefProjet'),verifyToken,accountsController.getNote) // Retourne la note d'un utilisateur
router.put('/:id/note',setRole('chefChantier','chefProjet'),verifyToken,accountsController.updateNote) // Retourne la note d'un utilisateur

module.exports = router