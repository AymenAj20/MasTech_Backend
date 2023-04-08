const ChefProjet = require("../Models/chefProjet");
const Chantier = require("../Models/chantier");
const Tache = require("../Models/tache");
const chantierController = require('../Controllers/chantierController')

// Retourne True si un chef existe
async function chefExiste(chefProjetID) {
  const chefProjet = await ChefProjet.findByPk(chefProjetID);

  return chefProjet != null;
}

exports.getTasks = async function (req, res) {
  try {
    const chefprojet = await ChefProjet.findByPk(req.params.id);

    if (!chefprojet) {
      return res.status(404).send({ message: "Chef de projet non trouvé" });
    }
    const projet = await Projet.findOne({
      where: { id: req.params.projetId, chefProjetId: req.params.id },
    });

    if (!projet) {
      return res.status(404).send({ message: "Projet non trouvé" });
    }
    const chantier = await Chantier.findOne(
      {
        where: { id: req.params.chantierId, ProjetId: req.params.projetId },
      },
      { include: { model: Tache } }
    );

    if (!chantier) {
      return res.status(404).send({ message: "Chantier non trouvé" });
    }
    res.status(200).send(chantier.Tache);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

// Methode qui renvoie la liste de tous les Chefs de Projets
exports.findAll = async function (req, res) {
  try {
    const chefProjetList = await ChefProjet.findAll();

    if (!chefProjetList) {
      return res
        .status(404)
        .send({ message: "Liste des chefs Projets Vide !!" });
    }

    return res.send(chefProjetList);
  } catch (error) {
    console.log(error);
  }
};

// Methode retourne chefProjet si existe
exports.findChefById = async function (req, res) {
  try {
    const chefprojet = await ChefProjet.findByPk(req.params.id);

    if (!chefprojet) {
      return res.status(404).send({ message: "Chef de projet non trouvé" });
    }

    return res.status(200).send(chefprojet);
  } catch (error) {
    console.log(error);
  }
};

// Ajoute un chefProjet
exports.addchefProject = async function (req, res) {
  const { body } = req;
  try {
    const chefProjetExist = await ChefProjet.findOne({
      where: { cin: body.cin },
    });
    if (chefProjetExist) {
      res.status(400).send("Chef existe");
    } else {
      await ChefProjet.create({ ...body });
      res.status(201).send("Chef projet cree avec succe");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating chef projet");
  }
};

// Methode qui renvoie la liste des projets pour un chef donné
exports.findChantiers = async function (req, res) {
  try {
    const chefprojet = await ChefProjet.findByPk(req.params.id, {
      include: { model: Chantier },
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

// Methode qui affecte un projet existant donné a un chefProjet existant donné
exports.affecterChantier = async function (req, res) {
  try {
    // Recuperation du ChefProjet a travers son ID
    const chefprojet = await ChefProjet.findByPk(req.params.id);

    if (!chefprojet) {
      return res.status(404).send({ message: "Chef de projet non trouvé" });
    }
    // Recuperation du chantier a travers son ID
    const chantier = await Chantier.findByPk(req.params.chantierId);

    if (!chantier) {
      return res.status(404).send({ message: "Chantier non trouvé" });
    }

    // Affectation de ID du chefProjet au champ ChefProjetId du class Chantier
    await chantier.update({ chefProjetId: chefprojet.id });

    res.send({
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
    const chefprojet = await ChefProjet.findByPk(req.params.id);

    if (!chefprojet) {
      return res.status(404).send({ message: "Chef de projet non trouvé" });
    }

    // Récupérer le chantier avec l'ID spécifié appartenant au chef de projet
    const chantier = await Chantier.findOne({
      where: { id: req.params.chantierId, chefProjetId: req.params.id },
    });

    if (!chantier) {
      return res.status(404).send({ message: "Chantier non trouvé" });
    }
    return res.status(200).send(chantier);
  } catch (error) {
    console.log(error);
  }
};

// Methode
exports.updateChefProjet = async function (req, res) {
  try {
    // Vérifier que le chef de projet existe
    const chefProjet = await ChefProjet.findByPk(req.params.id);
    if (!chefProjet) {
      return res.status(404).send({ message: "Chef de projet non trouvé" });
    }
    // Mettre à jour le chef de projet
    await chefProjet.update(req.body);
    return res.status(204);
  } catch (error) {
    console.log(error);
  }
};

// Methode qui supprimer un  Chefs de Projets
exports.deleteChefProjet = async function (req, res) {
  try {
    const chefProjet = await ChefProjet.findByPk(req.params.id);

    if (!chefProjet) {
      return res.status(404).send({ message: "Chef de projet non trouvé" });
    }
    await ChefProjet.destroy({ where: { id: req.params.id } });

    return res.status(200).send("Chef projet supprimé");
  } catch (error) {
    console.log(error);
  }
};


