const express = require ('express')
const router = express.Router()
const tacheController = require('../Controllers/tacheController')
const multer = require('multer')


const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
  };
  
  //From multer webSite documentation
  const storage = multer.diskStorage({
      destination: function (req, file, cb) {
          //const isValid = FILE_TYPE_MAP[file.mimetype];
          const isValid = true;
          let uploadError = new Error('invalid image type');
  
          if (isValid) {
              uploadError = null;
          }
          cb(uploadError, 'public/uploads/images');
      },
      filename: function (req, file, cb) {
          const fileName = file.originalname.split(' ').join('-');
          const extension = FILE_TYPE_MAP[file.mimetype];
          cb(null, `${fileName}-${Date.now()}.png`);
      }
  });
  const uploadOptions = multer({ storage: storage });

router.get('/:id',tacheController.findById)//Retourne une tache par son ID
router.post('/:chefChantierId/:chantierId',tacheController.addTache)//Ajoute une tache et l'affecte a un chantier et chefChantier
router.put('/:id',tacheController.updateTache)//Modifie une tache
router.put('/:id/valider',tacheController.validateTask)//Valider une tache
router.put('/:id/rectifier',uploadOptions.single('image'),tacheController.rectifierTask)//Rectifier une tache
router.put('/:id/terminer',tacheController.terminerTask)//Rectifier une tache

router.delete('/:id',tacheController.deleteTache)//Supprime une tache

 


module.exports = router 