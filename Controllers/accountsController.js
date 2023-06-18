const bcrypt = require("bcryptjs");
const Utilisateur = require("../Models/utilisateur");
const imageUpload = require('../helpers/imageUpload')


// Methode de modification d'un Utilisateur
exports.updateAccount = async function (req, res) { 
  const file = req.file;
    if (!file) return res.status(400).send('No image in the request'); 
    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
  if(req.body.password){
   updatedUser = {
    nom: req.body.nom,
    prenom: req.body.prenom,
    email: req.body.email,
    imageURL: `${basePath}${fileName}`,
    numTel: req.body.numTel,
    role: req.body.role,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    cin: req.body.cin,
  };
}else {
   updatedUser = {
    nom: req.body.nom,
    prenom: req.body.prenom,
    email: req.body.email,
    imageURL: `${basePath}${fileName}`,
    numTel: req.body.numTel,
    role: req.body.role,
    cin: req.body.cin,
  };
}
  try { 
    // Vérifier si l'untilisateur existe
    const user = await Utilisateur.findByPk(req.params.id);
    if (!user) {


      return res.status(404).send({ message: "Utilisateur non trouvé"});
    }
    console.log("je suis la");

    // Mettre à jour l'utilisateur
    //supprimer ancienne image 
    imageUpload.deleteImage(user.imageURL);
    await user.update(updatedUser);
    
    return res.status(200).send({message:'Utilisateur modifiée avec succès' });
  } catch (error) {
    return res.status(404).send({ message: error});
  }
};

exports.getNote = async function (req,res) {
  try {
    // Vérifier si l'untilisateur existe
    const user = await Utilisateur.findByPk(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "Utilisateur non trouvé"});
    }
    console.log(user.note);
    let note =user.note;
    res.status(200).send({note})
  } catch (error) {
    return res.status(404).send({ message: error});

  }
}

exports.updateNote = async function (req, res) {
  try {
    // Vérifier si l'utilisateur existe
    const user = await Utilisateur.findByPk(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "Utilisateur non trouvé" });
    }

    // Mettre à jour la note de l'utilisateur
    await user.update({ note: req.body.note });

    res.status(200).send({ message: "Note mise à jour avec succès" });
  } catch (error) {
    return res.status(500).send({ message: "Erreur lors de la mise à jour de la note" });
  }
};
