const Tache = require("../Models/tache");
const User = require("../Models/utilisateur");
const Chantier = require("../Models/chantier");

exports.findById = async function (req, res) {
  try {
    const tache = await Tache.findByPk(req.params.id);

    if (!tache) {
      return res.status(404).send({ message: " Tache non trouvé !!" });
    }

    return res.status(200).send(tache);
  } catch (error) {
    res.status(500).send("Server Error");
    console.log(error);
  }
};

exports.updateTache = async function (req, res) {
  try {
    const tache = await Tache.findByPk(req.params.id);

    if (!tache) {
      return res.status(404).send({ message: " Tache non trouvé !!" });
    }
    console.log(req.body);
    const newTask = {
      titre: req.body.titre,
      description: req.body.description,
      type: req.body.type,
      etat: req.body.etat,
      statut: req.body.statut,
      ChantierId: tache.chantierId,
      chefChantierId: tache.chefChantierId,
    };

    await tache.update(newTask);
    return res.status(200).send({ message: "tache modifiée avec succès" });
  } catch (error) {
    res.status(500).send("Server error");
    console.log(error);
  }
};

// Methode qui valide une tache
exports.validateTask = async function (req, res) {
  try {
    const tache = await Tache.findByPk(req.params.id);

    if (!tache) {
      return res.status(404).send({ message: " Tache non trouvé !!" });
    }
    await tache.update({statut:true});
    return res.status(200).send({ message: "tache validée avec succès" });
  } catch (error) {
    res.status(500).send("Server error");
    console.log(error);
  }
};

//Methode qui rectifie une tache
exports.rectifierTask = async function (req, res) {
  try {
    const tache = await Tache.findByPk(req.params.id);

    if (!tache) {
      return res.status(404).send({ message: " Tache non trouvé !!" });
    }
    const file = req.file;
        if (!file) return res.status(400).send('No image in the request');
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        
        // Création d'une nouvelle image

        const newImage = {
            imageUrl: `${basePath}${fileName}` // "http://localhost:3000/public/upload/image-2323232"
        };
   
    await tache.update({type:"rectification",imageURL:newImage.imageUrl,description:req.body.description});
    return res.status(200).send({ message: "tache rectifiée avec succès" });
  } catch (error) {
    res.status(500).send("Server error");
    console.log(error);
  }
};

//Methode qui change l'etat une tache
exports.terminerTask = async function (req, res) {
  try {
    const tache = await Tache.findByPk(req.params.id);

    if (!tache) {
      return res.status(404).send({ message: " Tache non trouvé !!" });
    }
    await tache.update({etat:true});
    return res.status(200).send({ message: "tache terminée" });
  } catch (error) {
    res.status(500).send("Server error");
    console.log(error);
  }
};

exports.deleteTache = async function (req, res) {
  try {
    const tache = await Tache.findByPk(req.params.id);

    if (!tache) {
      return res.status(404).send({ message: " Tache non trouvé !!" });
    }

    tache.destroy();
    res.status(200).send({ message: "Tache supprimée" });
  } catch (error) {
    res.status(500).send("Server error");
    console.log(error);
  }
};

exports.addTache = async function (req, res) {
  const newTask = {
    titre: req.body.titre,
    description: req.body.description,
    type: req.body.type,
    etat: req.body.etat,
    statut: req.body.statut,
    dateFin: req.body.dateFin,
    ChantierId: req.params.chantierId,
    UtilisateurId: req.params.chefChantierId,
  };
  if (!newTask) {
    return res.status(500).send({ message: " Tache vide !!" });
  }
  try {
    const chefChantier = await User.findByPk(req.params.chefChantierId);

    if (!chefChantier) {
      return res.status(404).send({ message: " ChefChantier non trouvé !!" });
    }

    const chantier = await Chantier.findByPk(req.params.chantierId);

    if (!chantier) {
      return res.status(404).send({ message: " Chantier non trouvé !!" });
    }

    // Add the new task to the database and retrieve the added task
    const addedTask = await Tache.create(newTask);
    // Return the ID of the added task
    res.status(201).send( addedTask );
  } catch (error) {
    res.status(500).send("Server error");
    console.log(error);
  }
};

