const express = require('express')
const router = express.Router()
const planController = require('../Controllers/planController')
const multer = require('multer')
const path = require('path')

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

//From multer webSite documentation
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads/plans');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});
const uploadOptions = multer({ storage: storage });


router.get('/',  planController.findAll)
router.get('/:id',  planController.findPlanById)
// router.get('/:id/zones',planController.findZones)
// router.get('/:id/zones/:zoneId',planController.getZoneById)
router.post('/',uploadOptions.single('image'), planController.addPlan)
// router.put('/:id/zones/:zoneId',planController.affecterZone) 






module.exports = router