const User = require("../Models/utilisateur");
const userValidator = require("../helpers/validators/utilisateurValidator");
const bcrypt = require("bcryptjs");

exports.register = async function (req, res) {
    const file = req.file;
        if (!file) return res.status(400).send('No image in the request');
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    let newUser = {
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      imageURL: `${basePath}${fileName}`,
      numTel: req.body.numTel,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      cin: req.body.cin,
      role: req.body.role,
    };
    try {
      const userExist = await User.findOne({
        where: { cin: newUser.cin },
      });
      if (userExist) {
        res.status(400).send("Utilisateur existe");
      } else {
        const { error } = userValidator.registerValidation({
          nom: newUser.nom,
          prenom: newUser.prenom,
          email: newUser.email,
          password: req.body.password,
        });
        if (error) {
          return res.status(401).send(error.details[0].message);
        }
        await User.create(newUser);
        res.status(201).send({message:"Utilisateur créé avec succès"});
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({message:"Erreur lors de la création de l'utilisateur"});
    }
  };

exports.findAll = async function (req, res) {
    try {
      const userList = await User.findAll();
  
      if (!userList ) {
        return res
          .status(404)
          .send({ message: "Aucun utilisateur n'a été trouvé!" });
      }
  
      return res.send(userList);
    } catch (error) {
      console.log(error);
    }
};

// Methode retourne utilsateur si existe
exports.findUserById = async function (req, res) {
    try {
      const user = await User.findByPk(req.params.id);
  
      if (!user) {
        return res.status(404).send({ message: "Utilisateur non trouvé" });
      }
  
      return res.status(200).send(user);
    } catch (error) {
      console.log(error);
    }
};

// Methode qui supprimer un  utilisateur
exports.deleteUser = async function (req, res) {
    try {
      const user = await User.findByPk(req.params.id);
  
      if (!user) {
        return res.status(404).send({ message: "Utilisateur n'existe pas" });
      }
      await User.destroy({ where: { id: req.params.id } });
  
      return res.status(200).send(user.role+"supprimé");
    } catch (error) {
      console.log(error);
    }
};

// Methode de modification d'un utilisateur
exports.updateUser = async function (req, res) {
  let updatedUser = {
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
      // Vérifier que l'utilisateur existe
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).send({ message: "Utilisateur n'existe pas" });
      }
      // Mettre à jour l'utilisateur 
      await user.update(updatedUser);
      return res.status(204);
    } catch (error) {
      console.log(error);
    }
  };