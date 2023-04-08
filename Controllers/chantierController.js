const Chantier = require("../Models/chantier");
const Etage = require("../Models/etage");
const Element = require("../Models/element");
const Tache = require("../Models/tache");
const { model } = require("../db/dbConnect");

// Retourne liste de touts les Chantiers
exports.findAll = async function (req, res) {
  try {
    const chantierList = await Chantier.findAll();

    if (!chantierList) {
      return res.status(404).send({ message: "Liste des Chantiers Vide !!" });
    }
    

    return res.status(200).send(chantierList);
  } catch (error) {
    console.log(error);
  }
};

// Methode qui cloture un chantier
exports.cloturerChahntier = async function (req, res) {
  try {
    const chantier = await Chantier.findByPk(req.params.id);

    if (!chantier) {
      return res.status(404).send({ message: " Chantier non trouvé !!" });
    }
    await chantier.update({etat:true});
    return res.status(200).send({ message: "tache validée avec succès" });
  } catch (error) {
    res.status(500).send("Server error");
    console.log(error);
  }
};

exports.getTasks = async function (req, res) {
  try {
    const chantier = await Chantier.findByPk(req.params.id, {
      include: { model: Tache },
    });

    if (!chantier) {
      return res.status(404).send({ message: " Chantier non trouvé !!" });
    }
    res.status(200).send(chantier.Taches);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

exports.findById = async function (req, res) {
  try {
    const chantier = await Chantier.findByPk(req.params.id);

    if (!chantier) {
      return res.status(404).send({ message: " Chantier non trouvé !!" });
    }

    return res.status(200).send(chantier);
  } catch (error) {
    console.log(error);
  }
};

// Methode qui renvoie la liste des chantiers d'un Projet
exports.findEtages = async function (req, res) {
  try {
    const chantier = await Chantier.findByPk(req.params.id, {
      include: { model: Etage },
    });

    if (!chantier) {
      return res.status(404).send({ message: " Chantier non trouvé !!" });
    }
    res.status(200).send(chantier.Etages);
  } catch (error) {
    console.log(error);
  }
};

exports.getEtageById = async function (req, res) {
  try {
    const etage = await Etage.findOne({
      where: { id: req.params.etageId, ChantierId: req.params.id },
    });

    if (etage) {
      res.status(200).json(etage);
    } else {
      res
        .status(404)
        .json({
          message: `Etage avec id ${req.params.etageId} n'est pas trouvé dans le chantier avec id ${req.params.id}`,
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Modifie un chantier
exports.updateChantier = async function (req, res) {
  try {
    const chantier = await Chantier.findByPk(req.params.id);

    if (!chantier) {
      return res.status(404).send({ message: " Chantier non trouvé !!" });
    }

    await chantier.update(req.body);
    return res.status(200).send({ message: "Chantier modifié avec succès" });
  } catch (error) {
    console.log(error);
  }
};

// Ajoute un chantier
exports.addChantier = async function (req, res) {
  const { body } = req;
  try {
    await Chantier.create({ ...body });
    res.status(201).send("Chantier created");
  } catch (error) {
    console.log(error);
  }
};

exports.affecterEtage = async function (req, res) {
  try {
    const chantier = await Chantier.findByPk(req.params.id);

    if (!chantier) {
      return res.status(404).send({ message: " Chantier non trouvé !!" });
    }

    const etage = await Etage.findByPk(req.params.etageId);

    if (!etage) {
      return res.status(404).send({ message: " Etage non trouvé !!" });
    }

    await etage.update({ ChantierId: chantier.id });

    res.send({
      message: "Etage affecté au chantier avec succès",
      etage: etage,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getAvancement = async function(chantier) {
  try {
    let totalElements = 0;
    let estimElements = 0;
    let elabElements = 0;
    let fabElements = 0;
    let etages = await Etage.findAll({ where: { chantierId: chantier.id } });
    for (let etage of etages) {
      let elements = await Element.findAll({ where: { etageId: etage.id } });
      for (let element of elements) {
        totalElements++;
        if (element.phase === "estimation") {
          estimElements++;
        }
        if (element.phase === "elaboration") {
          elabElements++;
        }
        if (element.phase === "fabrication") {
          fabElements++;
        }
      }
    }
    if (totalElements > 0) {
      let estimPercent = Math.round((estimElements / totalElements) * 100);
      let elabPercent = Math.round((elabElements / totalElements) * 100);
      let fabPercent = Math.round((fabElements / totalElements) * 100);
      let avancement = Math.round(
        fabPercent * 0.99 + estimPercent * 0.33 + elabPercent * 0.66
      );
      return {
        percentAV: avancement,
        percentEstim: estimPercent,
        percentElab: elabPercent,
        percentFab: fabPercent,
      };
    } else {
      return { percentAV: 0, percentEstim: 0, percentElab: 0, percentFab: 0 };
    }
  } catch (error) {
    console.log(error);
    return { percentAV: 0, percentEstim: 0, percentElab: 0, percentFab: 0 };
  }
}
