const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const createToken = require("../helpers/jwt");

const User = require("../Models/utilisateur");
const { updateUser } = require("./adminController");

// Définir les rôles des acteurs
const roles = {
  Admin: process.env.ADMIN_SECRET_KEY,
  chefProjet: process.env.CHEFPROJET_SECRET_KEY,
  chefChantier: process.env.CHEFCHANTIER_SECRET_KEY,
};

// Methode pour définir les rôles de l'utilisateur
exports.setRole = function (...roles) {
  return (req, res, next) => {
    req.roles = roles;
    next();
  };
};

// Methode de vérification du token d'authentification
exports.verifyToken = (req, res, next) => {
  // Récupérer le token d'authentification dans le header de la requête
  const token = req.headers["authorization"];
  if (!token) {
    // Si le token n'existe pas, renvoyer une erreur 401 (non autorisé)
    return res.status(401).send("Token non valide.");
  }

  try {
    // Vérifier le token avec la clé secrète appropriée pour chaque rôle de l'utilisateur
    let decoded;
    for (let role of req.roles) {
      try {
        decoded = jwt.verify(token, roles[role]);
        break;
      } catch (err) {
        continue;
      }
    }

    if (!decoded) {
      // Si le token n'est pas valide pour aucun des rôles de l'utilisateur, renvoyer une erreur 403 (interdit)
      return res.status(403).send("Vous n'êtes pas autorisé.");
    }

    req.user = decoded;
    next();
  } catch (err) {
    // Si une erreur survient, renvoyer une erreur 500 (erreur interne du serveur)
    res.status(500).send("Erreur interne du serveur.");
  }
};

exports.login = async function (req, res) {
  try {
    const user = await User.findOne({ where: { cin: req.body.cin } });
    if (!user) {
      return res.status(400).send({message:"Utilisateur n'existe pas."});
    }

    // Supprimer la propriété passwordHash de l'objet utilisateur
    const { passwordHash, ...userWithoutPassword } = user.toJSON();

    if (bcrypt.compareSync(req.body.password, user.passwordHash)) {
      const token = createToken(
        { 
          userID: user.id,
          role: user.role,
        },
        roles[user.role]
      );

      res.status(200).send({
        message: "User Authenticated.",
        user: userWithoutPassword, // Utilisateur sans le mot de passe
        token: token,
      });
    } else {
      res.status(400).send({message:"Mot de passe incorrect."});
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error au serveur." });
  }
};


