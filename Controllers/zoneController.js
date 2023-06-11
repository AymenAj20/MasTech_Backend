const Zone = require("../Models/zone");

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

// exports.addZone = async function (req, res) {
//     const { body } = req;
//     try {
//       await Zone.create({ ...body });
//       res.status(201).send("Zone created");

//     } catch (error) {
//       console.log(error);
//     }
//   };

exports.addZone = async function (req, res) {
    const newZone = {
      "x" : req.body.x,
      "y" : req.body.y,
      "width" : req.body.width,
      "height" : req.body.height,
      "ElementId" : req.params.elementId
    }
    try {
      await Zone.create(newZone);

        res.status(201).send({message:"Zone created"});

    } catch (error) {
      res.status(500).send({message:"Server error"})
      console.log(error);
    }
  };
