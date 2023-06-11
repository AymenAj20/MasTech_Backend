const User = require("../Models/utilisateur");
const Chantier = require("../Models/chantier");
const bcrypt = require("bcryptjs");
const imageUpload = require('../helpers/imageUpload')


const chantierController = require('../Controllers/chantierController');

async function isChefProjet(id) {
  const user = await User.findByPk(id);
  if (user && user.role === 'chefProjet') {
    return user;
  }
  return null;
}

// Methode qui renvoie la liste de tous les Chefs de Projets
exports.findAll = async function (req, res) {
  try {
    const chefProjetList = await User.findAll({
      where: { role: "chefProjet" }
    });
    
    if (!chefProjetList || chefProjetList.length === 0) {
      return res
        .status(404)
        .send({ message: "Aucun chefProjet n'a été trouvé!" });
    }

    return res.send(chefProjetList);
  } catch (error) {
    console.log(error);
  }
};

// Methode retourne chefProjet si existe
exports.findChefById = async function (req, res) {
  try {
    const chefprojet = await isChefProjet(req.params.id);
    // Supprimer la propriété passwordHash de l'objet utilisateur
    const { passwordHash, ...userWithoutPassword } = chefprojet.toJSON();
    if (!chefprojet) {
      return res.status(404).send({ message: "Chef de projet non trouvé" });
    }

    return res.status(200).send(userWithoutPassword);
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
};


// Methode qui renvoie la liste des projets pour un chef donné
exports.findChantiers = async function (req, res) {
  try {
    const chefprojet = await User.findByPk(req.params.id, {
      include: { model: Chantier },
      where :{role:'chefProjet'}
    });

    if (!chefprojet) {
      return res.status(404).send({ message: "Chef de projet non trouvé" });
    }
    const listChantiers =chefprojet.Chantiers

    if (!listChantiers) {
      return res.status(404).send({ message: "Pas de chantiers !!" });
    }

    for (let chantier of listChantiers) {
      const avancement = await chantierController.getAvancement(chantier);
      chantier.percentAvancement = avancement.percentAV;
      chantier.percentEstimation = avancement.percentEstim;
      chantier.percentElaboration = avancement.percentElab;
      chantier.percentFabrication = avancement.percentFab;
    }

    res.status(200).send(listChantiers);
  } catch (error) {
    console.log(error);
  }
};
// Methode qui supprimer un  Chefs de Projets
exports.deleteChefProjet = async function (req, res) {
  try {
    const chefProjet = await User.findByPk(req.params.id);

    if (!chefProjet) {
      return res.status(404).send({ message: "Chef de projet non trouvé" });
    }
    await chefProjet.destroy({ where: { id: req.params.id } });

    return res.status(200).send( {message: "Chef projet supprimé"});
  } catch (error) {
    console.log(error);
  }
};

// Methode qui Ajouter un chefProjet
exports.addChefProjet = async function (req, res) {
  let newUser = {
    nom: req.body.nom,
    prenom: req.body.prenom,
    email: req.body.email,
    imageURL: req.body.imageURL,
    numTel: req.body.numTel,
    role: req.body.role,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    cin: req.body.cin,
  };
  try {
    const chefChantierExist = await User.findOne({
      where: { cin: newUser.cin, role: "chefProjet" },
    });

    if (chefChantierExist) {
      res.status(400).send({message:"Chef existe"});
    } else {
      await User.create(newUser);
      
      //Recherchez l'utilisateur et enregistrez-le dans la variable "res" 
     const  userSend= await  User.findOne({
      where: { cin: newUser.cin, role: "chefProjet" },
    });     
        // Supprimer la propriété passwordHash de l'objet utilisateur
  const { passwordHash, ...userWithoutPassword } = userSend.toJSON();
      res.status(200).send({message:"Chef projet cree avec succès",data:userWithoutPassword});
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({message:"Server Error"});
  }
};


// Methode qui affecte un projet existant donné a un chefProjet existant donné
exports.affecterChantier = async function (req, res) {
  try {
    // Recuperation du ChefProjet a travers son ID
    const chefprojet = await isChefProjet(req.params.id);

    if (!chefprojet) {
      return res.status(404).send({ message: "Chef de projet non trouvé" });
    }
    // Recuperation du chantier a travers son ID
    const chantier = await Chantier.findByPk(req.params.chantierId);

    if (!chantier) {
      return res.status(404).send({ message: "Chantier non trouvé" });
    }

    // Affectation de ID du chefProjet au champ UtilisateurId du class Chantier
    await chantier.update({ UtilisateurId: chefprojet.id });

    res.status(200).send({
      message: "Chantier affecté au chef de projet avec succès",
      chantier: chantier,
    });
  } catch (error) {
    console.log(error);
  }
};

// Methode renvoie un chantier precis d'un chefProjet precis
exports.getChantierById = async function (req, res) {
  try {
    // Recuperation du ChefProjet a travers son ID
    const chefprojet = await isChefProjet(req.params.id);

    if (!chefprojet) {
      return res.status(404).send({ message: "Chef de projet non trouvé" });
    }

    // Récupérer le chantier avec l'ID spécifié appartenant au chef de projet
    const chantier = await Chantier.findOne({
      where: { id: req.params.chantierId, UtilisateurId: req.params.id },
    });

    if (!chantier) {
      return res.status(404).send({ message: "Chantier non trouvé" });
    }
    return res.status(200).send(chantier);
  } catch (error) {
    console.log(error);
  }
};

// Methode de modification d'un chefProjet
exports.updateChefProjet = async function (req, res) {
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
    // Vérifier que le chef de projet existe
    const chefProjet = await isChefProjet(req.params.id);
    if (!chefProjet) {


      return res.status(404).send({ message: "Chef de projet non trouvé"});
    }


    // Mettre à jour le chef de projet
    //supprimer ancienne image 
    imageUpload.deleteImage(chefProjet.imageURL);
    await chefProjet.update(updatedUser);
    
    return res.status(200).send({message:'chefProjet modifiée avec succès' });
  } catch (error) {
    return res.status(404).send({ message: err});
  }
};




