const express = require('express')
const router = express.Router()
const elementController = require('../Controllers/elementController')


router.get('/', elementController.findAll)
router.get('/:id', elementController.findById)
router.get('/:id/zone', elementController.findZone) // Retourne le zone de l'element
router.post('/', elementController.addElement)
router.put('/:id', elementController.updateElement)
router.put('/:id/zones', elementController.affecterZone)



module.exports = router