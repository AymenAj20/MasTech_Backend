const multer = require("multer");
const fs = require("fs");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
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


// Méthode pour supprimer une image
exports.deleteImage = function (imageUrl) {
  const fileName = imageUrl.split("/").pop(); 
  console.log(fileName);
  const imagePath = `public/uploads/images/${fileName}`;

  fs.unlink(imagePath, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

exports.uploadOptions = multer({ storage: storage });



        
