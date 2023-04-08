const Plan = require("../Models/plan");
const Zone = require("../Models/zone");
const { model } = require("../db/dbConnect");



// Ajouter une image d'un plan
exports.addPlan = async function (req, res) {
    try {
        const file = req.file;
        if (!file) return res.status(400).send('No image in the request');
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        // Création d'une nouvelle image
        const newImage = {
            imageUrl: `${basePath}${fileName}` // "http://localhost:3000/public/upload/image-2323232"
        };
        Plan.create(newImage)
            .then(image => {
                res.send('Image ajoutée avec succès');
            })
    } catch (error) {
        res.status(500).send("Probleme de serveur")
        console.log(error);
    }
}

exports.findAll = async function (req, res) {
    try {
        const planList = await Plan.findAll();

        if (!planList) {
            return res.status(404).send({ message: "Liste des Plans Vide !!" });
        }

        return res.status(200).send(planList);
    } catch (error) {
        res.status(500).send('Probleme de serveur')
        console.log(error);
    }
}

exports.getZoneById = async function (req, res) {
    try {
        const zone = await Zone.findOne({
            where: { id: req.params.zoneId, PlanId: req.params.id }
        });

        if (zone) {
            res.status(200).json(zone);
        } else {
            res.status(404).json({ message: `Zone avec id ${req.params.zoneId} n'est pas trouvé dans Plan avec id ${req.params.id}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.findZones = async function (req, res) {
    try {
        const plan = await Plan.findByPk(req.params.id, {
            include: { model: Zone },
        });

        if (!plan) {
            return res.status(404).send({ message: " Plan non trouvé !!" });
        }
        res.status(200).send(plan.Zones);
    } catch (error) {
        console.log(error);
    }
}

exports.findPlanById = async function (req, res) {
    try {
        const plan = await Plan.findByPk(req.params.id);

        if (!plan) {
            return res.status(404).send({ message: " Plan non trouvé !!" });
        }

        return res.status(200).send(plan);
    } catch (error) {
        res.status(500).send('Probleme de serveur')
        console.log(error);
    }
}

exports.affecterZone = async function (req, res) {
    try {
        const plan = await Plan.findByPk(req.params.id);

        if (!plan) {
            return res.status(404).send({ message: " Plan non trouvé !!" });
        }

        const zone = await Zone.findByPk(req.params.zoneId);

        if (!zone) {
            return res.status(404).send({ message: " Zone non trouvé !!" });
        }

        await zone.update({ PlanId: plan.id })

        res.send({
            message: "Plan affecté au projet avec succès",
            plan: plan,
        });

    } catch (error) {
        console.log(error);
    }
}