const Tache = require("../Models/tache");
const ChefChantier = require("../Models/chefChantier");
const Chantier = require("../Models/chantier");

const { model } = require("../db/dbConnect");



exports.findAll = async function (req, res) {
    try {
        const chefChantierList = await ChefChantier.findAll();

        if (!chefChantierList) {
            return res.status(404).send({ message: "Liste des chef Chantier Vide !!" });
        }

        return res.status(200).send(chefChantierList);
    } catch (error) {
        res.status(500).send("Server Error")
        console.log(error);
    }
}

exports.findById = async function (req, res) {
    try {
        const chefChantier = await ChefChantier.findByPk(req.params.id);

        if (!chefChantier) {
            return res.status(404).send({ message: " ChefChantier non trouvé !!" });
        }

        return res.status(200).send(chefChantier);
    } catch (error) {
        res.status(500).send("Server Error")
        console.log(error);
    }
}

exports.updateChefChantier = async function (req, res) {
    try {
        const chefChantier = await ChefChantier.findByPk(req.params.id);

        if (!chefChantier) {
            return res.status(404).send({ message: " ChefChantier non trouvé !!" });
        }

        await chefChantier.update(req.body);
        return res.status(200).send({ message: "ChefChantier modifiée avec succès" });
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error")
    }
};

exports.addChefChantier = async function (req, res) {
    const { body } = req;
    try {
        await ChefChantier.create({ ...body });
        res.status(201).send("ChefChantier created");

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error")

    }
};

exports.findAllTasks = async function (req, res) {
    try {
        const chefChantier = await ChefChantier.findByPk(req.params.id, {
            include: { model: Tache },
        });

        if (!chefChantier) {
            return res.status(404).send({ message: " ChefChantier non trouvé !!" });
        }
        res.status(200).send(chefChantier.Taches);
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error")
    }
}

//retourne les Chantiers aux quelle le chefChantiers possede des taches
exports.findChantiers = async function (req, res) {
    try {
        const chantiers = await Chantier.findAll({
            include: [
                {
                    model: Tache,
                    where: { chefChantierId: req.params.id },
                    attributes: [] // Ignorer les attributs de Tache
                },
            ],
        });

        res.status(200).send(chantiers);
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
}


exports.findChantierTasks = async function (req, res) {
    try {
        const chefChantier = await ChefChantier.findByPk(req.params.id);
        if (!chefChantier) {
            return res.status(404).send({ message: "ChefChantier non trouvé !!" });
        }

        const taches = await Tache.findAll({
            where: { 
                chefChantierId: req.params.id,
                chantierId: req.params.chantierId
            }
        });

        res.status(200).send(taches);
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error")
    }
}


exports.findToDoTasks = async function (req, res) {
    try {
        const chefChantier = await ChefChantier.findByPk(req.params.id, {
            include: { model: Tache,where: { etat: false } },
        });

        if (!chefChantier) {
            return res.status(404).send({ message: " ChefChantier non trouvé !!" });
        }
        res.status(200).send(chefChantier.Taches);
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error")
    }
}

// Methode qui supprimer un  Chefs de Chantier
exports.deleteChefChantier = async function (req, res) {
    try {
      const chefChantier= await chefChantier.findByPk(req.params.id);
  
      if (!chefChantier) {
        return res.status(404).send({ message: "Chef de Chantier non trouvé" });
      }
      await chefChantier.destroy({ where: { id: req.params.id } });
  
      return res.status(200).send("Chef Chantier supprimé");
    } catch (error) {
      console.log(error);
    }
  };