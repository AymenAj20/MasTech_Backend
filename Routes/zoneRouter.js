const express = require('express')
const router = express.Router()
const zoneController = require('../Controllers/zoneController')



router.get('/:id/elements/elementId', zoneController.getElementById) // rakez get elem return type elem
router.post('/element/:elementId', zoneController.addZone)
router.put('/:id', zoneController.updateZone)



module.exports = router