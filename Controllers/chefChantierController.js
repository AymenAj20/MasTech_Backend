const Tache = require("../Models/tache");
const User = require("../Models/utilisateur");
const Chantier = require("../Models/chantier");
const bcrypt = require("bcryptjs");
const chantierController = require('../Controllers/chantierController');


const { model } = require("../db/dbConnect");

async function isChefChantier(id) {
  const user = await User.findByPk(id);
  if (user && user.role === "chefChantier") {
    return user;
  }
  return null;
}

exports.findAll = async function (req, res) {
  try {
    const chefChantierList = await User.findAll({
      where: { role: "chefChantier" },
    });

    if (!chefChantierList) {
      return res
        .status(404)
        .send({ message: "Liste des chefs de chantier vide !!" });
    }

    return res.status(200).send(chefChantierList);
  } catch (error) {
    res.status(500).send("Server Error");
    console.log(error);
  }
};

exports.findById = async function (req, res) {
  try {
    const chefChantier = await isChefChantier(req.params.id);
 // Supprimer la propriété passwordHash de l'objet utilisateur
 const { passwordHash, ...userWithoutPassword } = chefChantier.toJSON();
    if (!chefChantier) {
      return res.status(404).send({ message: " ChefChantier non trouvé !!" });
    }

    return res.status(200).send(userWithoutPassword);
  } catch (error) {
    res.status(500).send("Server Error");
    console.log(error);
  } 
};

exports.updateChefChantier = async function (req, res) {
  
  if(req.body.password){
    updatedUser = {
     nom: req.body.nom,
     prenom: req.body.prenom,
     email: req.body.email,
     imageURL: req.body.imageURL,
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
     imageURL: req.body.imageURL,
     numTel: req.body.numTel,
     role: req.body.role,
     cin: req.body.cin,
   };
 }
  try {
    const chefChantier = await isChefChantier(req.params.id);
    if (!chefChantier) {
      return res.status(404).send({ message: " ChefChantier non trouvé !!" });
    }

    await chefChantier.update(updatedUser);
    return res.status(200).send({ message: "ChefChantier modifiée avec succès" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};
// Methode qui supprimer un  Chefs de Chantier
exports.deleteChefChantier = async function (req, res) {
  try {
    const chefChantier= await User.findByPk(req.params.id);

    if (!chefChantier) {
      return res.status(404).send({ message: "Chef  Chantier non trouvé" });
    }
    await chefChantier.destroy({ where: { id: req.params.id } });

    return res.status(200).send({ message:  "Chef Chantier supprimé" });
  } catch (error) {
    console.log(error);
  }
};
// Methode qui Ajouter un chef Chantier
exports.addChefChantier = async function (req, res) {
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
      where: { cin: newUser.cin, role: "chefChantier" },
    });

    if (chefChantierExist) {
      res.status(400).send({message:"Chef existe"});
    } else {
      await User.create(newUser);
      
      //Recherchez l'utilisateur et enregistrez-le dans la variable "res"
     const  userSend= await  User.findOne({
        where: { cin: newUser.cin, role: "chefChantier" },
      });     
          // Supprimer la propriété passwordHash de l'objet utilisateur
    const { passwordHash, ...userWithoutPassword } = userSend.toJSON();
      
       res.status(200).send({message:"Chef chantier cree avec succès",data:userWithoutPassword});
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({message:"Server Error"});
  }
};

exports.findAllTasks = async function (req, res) {
  try {
    const chefChantier = await User.findByPk(req.params.id, {
      include: { model: Tache },
      where: { role: "chefChantier" },
    });

    if (!chefChantier) {
      return res.status(404).send({ message: " ChefChantier non trouvé !!" });
    }
    res.status(200).send(chefChantier.Taches);
  } catch (error) {
    console.log(error);
    res.status(500).send({message:"Server Error"});
  }
};

//retourne les Chantiers aux quelle le chefChantiers possede des taches
exports.findChantiers = async function (req, res) {
  try {
    const chantiers = await Chantier.findAll({
      include: [
        {
          model: Tache,
          where: { UtilisateurId: req.params.id },
          attributes: [], // Ignorer les attributs de Tache
        },
      ],
    });

    for (let chantier of chantiers) {
      const avancement = await chantierController.getAvancement(chantier);
      chantier.percentAvancement = avancement.percentAV;
      chantier.percentEstimation = avancement.percentEstim;
      chantier.percentElaboration = avancement.percentElab;
      chantier.percentFabrication = avancement.percentFab;
      
    }
    
    res.status(200).send(chantiers);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

exports.findChantierTasks = async function (req, res) {
  try {
    const chefChantier = await isChefChantier(req.params.id);
    if (!chefChantier) {
      return res.status(404).send({ message: "ChefChantier non trouvé !!" });
    }

    const taches = await Tache.findAll({
      where: {
        UtilisateurId: req.params.id,
        chantierId: req.params.chantierId,
        etat:false,
        statut:false
      },
    });

    res.status(200).send(taches);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};


