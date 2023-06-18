const Element = require("../Models/element");
const Etage = require("../Models/etage");
const Plan = require("../Models/plan");
const { model } = require("../db/dbConnect");



// Retourne liste de touts les Chantiers
exports.findAll = async function (req, res) {
  try {
    const etageList = await Etage.findAll();

    if (!etageList) {
      return res.status(404).send({ message: "Liste des Etages Vide !!" });
    }

    return res.status(200).send(etageList);
  } catch (error) {
    console.log(error);
  }
};

exports.findById = async function (req,res) {
  try {
    const etage = await Etage.findByPk(req.params.id);

    if (!etage) {
      return res.status(404).send({ message: " Etage non trouvé !!" });
    }

    return res.status(200).send(etage);
  } catch (error) {
    console.log(error);
  }
}

// Methode qui renvoie la liste des elements d'un etage
exports.findElements =  async function (req,res) {
    try {
      const etage = await Etage.findByPk(req.params.id,{
        include : {model:Element},
      });
  
      if (!etage) {
        return res.status(404).send({ message: " Etage non trouvé !!" });
      }
      res.status(200).send(etage.Elements);
    } catch (error) {
      console.log(error);
    }
}

exports.getElementById = async function (req,res) {
    try {
      const element = await Element.findOne({
        where: { id: req.params.elementId, EtageId: req.params.id }
      });
  
      if (element) {
        res.status(200).json(element);
      } else {
        res.status(404).json({ message: `Element avec id ${req.params.elementId} n'est pas trouvé dans l'etage avec id ${req.params.id}` });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
}

exports.getPlan = async function (req,res) {
  try {
    const etage = await Etage.findByPk(req.params.id, {
      include: { model: Plan },
    });

    if (!etage) {
      return res.status(404).send({ message: "Etage non trouvé" });
    }

    if (!etage.Plan) {
      return res.status(404).send({ message: "Etage en possede pas de plan" });
    }

    res.status(200).send(etage.Plan);
  } catch (error) {
    console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
}

// Modifie un etage
exports.updateEtage = async function (req, res) {
    try {
      
      const etage = await Etage.findByPk(req.params.id);
  
      if (!etage) {
        return res.status(404).send({ message: " Etage non trouvé !!" });
      }
  
      await etage.update(req.body);
      return res.status(200).send({message:"Etage modifié avec succès"});
    } catch (error) {
      console.log(error);
    }
  };
  
  // Ajoute un chantier
  exports.addEtage = async function (req, res) { 
    const { body } = req;
    try {
      await Etage.create({ ...body });
      res.status(201).send({message:"Etage created"});
      
    } catch (error) {
      console.log(error);
    }
  };

exports.affecterElement = async function (req,res) {
    try {
      const etage = await Etage.findByPk(req.params.id);
  
      if (!etage) {
        return res.status(404).send({ message: " Etage non trouvé !!" });
      }
  
      const element = await Element.findByPk(req.params.elementId);
  
      if (!element) {
        return res.status(404).send({ message: " Element non trouvé !!" });
      }
  
      await element.update({EtageId: etage.id })
  
      res.send({
        message: "Element affecté a l'etage avec succès",
        element: element,
      });
  
    } catch (error) {
      console.log(error);
    }
}

exports.affecterPlan = async function (req,res) {
  try {
    const etage = await Etage.findByPk(req.params.id);

    if (!etage) {
      return res.status(404).send({ message: " Etage non trouvé !!" });
    }

    const plan = await Plan.findByPk(req.params.planId);

    if (!plan) {
      return res.status(404).send({ message: " Plan non trouvé !!" });
    }

    await plan.update({EtageId: etage.id })

    res.send({
      message: "Plan affecté a l'etage avec succès",
      planURL: plan,
    });

  } catch (error) {
    console.log(error);
  }
}