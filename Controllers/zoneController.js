const Zone = require("../Models/zone");
const Element = require("../Models/element");

const { model } = require("../db/dbConnect");



exports.updateZone = async function (req, res) {
    try {
        const zone = await Zone.findByPk(req.params.id);

        if (!zone) {
            return res.status(404).send({ message: " zone non trouvé !!" });
        }

        await zone.update(req.body);
        return res.status(200).send({ message: "zone modifiée avec succès" });
    } catch (error) {
        console.log(error);
    }
};

exports.getElementById = async function (req,res) {
  try {

  } catch (error) {
    console.log(error);
  }
}


exports.addZone = async function (req, res) {
    const newZone = {
      "x" : req.body.x,
      "y" : req.body.y,
      "width" : req.body.width,
      "height" : req.body.height,
      "ElementId" : req.params.elementId
    }
    try {
      const addedZone = await Zone.create(newZone);
console.log(addedZone.id);
        res.status(201).send(addedZone); 

    } catch (error) {
      res.status(500).send("Server error")
      console.log(error);
    }
  };

  exports.deleteZone = async function (req, res) {
    try {
      const zoneId = req.params.id;
  
      // Trouver la zone à supprimer et extraire son ElementId
      const zone = await Zone.findByPk(zoneId);
      if (!zone) {
        return res.status(404).json({ message: 'Zone non trouvée' });
      }
      const elementId = zone.ElementId;
  
      
  
      // Mettre à jour le champ "affecte" de l'élément correspondant
      const element = await Element.findByPk(elementId);
      if (!element) {
        return res.status(404).json({ message: 'Élément non trouvé' });
      }
      // Supprimer la zone
      await zone.destroy();
      await element.update({ affecte: false });
  
      res.status(200).json({ message: 'Zone supprimée avec succès' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
  
