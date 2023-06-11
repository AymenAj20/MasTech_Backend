const bcrypt = require("bcryptjs");
const User = require("../Models/utilisateur");


async function isUser(id) {
  const user = await User.findByPk(id);
  if (user ) {
    return user;
  }
  return null;
}

// Methode de modification de profil
exports.updateAccount = async function (req, res) {
  const file = req.file;
  updatedUser = {
    nom: req.body.nom,
    prenom: req.body.prenom,
    email: req.body.email,
    numTel: req.body.numTel,
    cin: req.body.cin,
  };
  if (file) 
  {
   fileName = file.filename;
   basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
   updatedUser.imageURL= `${basePath}${fileName}`;
  }
  if (req.body.password) {
    updatedUser.passwordHash = bcrypt.hashSync(req.body.password , 10); 
  }
  try { 
    // Vérifier que user existe
    const user = await isUser(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "cette compte non trouvé"});
    }
    // Mettre à jour le chef de projet

    await user.update(updatedUser);
    // Supprimer la propriété passwordHash de l'objet utilisateur
    const { passwordHash, ...userWithoutPassword } = updatedUser;

    return res.status(200).send({message:"compte modifiée avec succès" ,data:userWithoutPassword});
  } catch (error) {
    return res.status(404).send({ message: "Echec de mise à jour "});
  }
};