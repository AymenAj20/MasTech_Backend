const pdfMake = require("pdfmake");
const fs = require("fs");
const path = require("path");
const Chantier = require("../Models/chantier");
const chantierController = require("../Controllers/chantierController");
const Etage = require("../Models/etage");
const Element = require("../Models/element");
const Utilisateur = require("../Models/utilisateur");

// Définir les fichiers de police
var fonts = {
  Roboto: {
    normal: "helpers/assets/fonts/Roboto/Roboto-Regular.ttf",
    bold: "helpers/assets/fonts/Roboto/Roboto-Medium.ttf",
    italics: "helpers/assets/fonts/Roboto/Roboto-Italic.ttf",
    bolditalics: "helpers/assets/fonts/Roboto/Roboto-MediumItalic.ttf",
  },
};

const printer = new pdfMake(fonts);

function formatDate(date) {
  const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
}


exports.generateRapport = async function (req, res) {
  const { projet } = req.body;
  const chefProjet = await Utilisateur.findByPk(req.params.id);
  const chantier = await Chantier.findByPk(req.params.idChantier);

  const avancement = await chantierController.getAvancement(chantier);
  let percentAvancement = avancement.percentAV;
  let percentEstimation = avancement.percentEstim;
  let percentElaboration = avancement.percentElab;
  let percentFabrication = avancement.percentFab;

  const elements = [];
  const etages = await Etage.findAll({ where: { chantierId: chantier.id } });
  for (let etage of etages) {
    let etageElements = await Element.findAll({ where: { etageId: etage.id } });
    elements.push(...etageElements);
  }

  const donnees = {
    responsable: chefProjet.nom +' '+chefProjet.prenom ,
    dateDebut: chantier.date_debut,
    dateFin: chantier.date_fin,
    avancement: percentAvancement + "%",
    budget: {
      total: chantier.budgetTotal,
      depenses: chantier.budgetDepenses,
      restant: chantier.budgetRestant,
    },
  };

  const tableauSuivi = [
    ["Tâche", "Responsable", "Statut"],
    ["Préparation du site", "Jane Smith", "Terminé"],
    ["Fondations", "John Doe", "En cours"],
    ["Maçonnerie", "Bob Johnson", "À venir"],
  ];

  const docDefinition = {
    header: {
      margin: [30, 20, 0, 0],
      columns: [
        {
          image: "helpers/assets/mas.jpeg",
          fit: [50, 50],
          alignment: "left",
        },
        {
          text: "",
          alignment: "center",
          fontSize: 16,
          bold: true,
        },
      ],
    },
    footer: function (currentPage, pageCount) {
      return {
        text:
          "Page " +
          currentPage.toString() +
          " / " +
          pageCount +
          " - Généré avec MasTech",
        alignment: "center",
        margin: [0, 0, 0, 20],
      };
    },
    content: [
      {
        text: "Compte rendu: " + chantier.nom,
        style: "header",
        alignment: "center",
      },
      {
        text: "Responsable du suivi : " + donnees.responsable,
        style: "description",
      },
      {
        text: "Période du suivi : " + formatDate(donnees.dateDebut) + " - " + formatDate(donnees.dateFin),

        style: "description",
      },
      {
        text: "Avancement : " + donnees.avancement,
        style: "description",
        margin: [0, 0, 0, 20],
      },
      {
        table: {
          widths: ["auto", "auto", "auto"],
          body: tableauSuivi,
        },
        layout: {
          fillColor: function (rowIndex, node, columnIndex) {
            return rowIndex === 0 ? "#CCCCCC" : null;
          },
        },
        margin: [0, 0, 0, 20],
      },
      {
        text: "Phases",
        style: "header",
        alignment: "center",
      },
      {
        text: "Elaboration :" + percentElaboration,
        style: "description",
      },
      {
        text: "Estimation :" + percentEstimation,
        style: "description",
      },
      {
        text: "Fabrication :" + percentFabrication,
        style: "description",
      },
      {
        text: "Éléments du chantier",
        style: "header",
        alignment: "center",
        margin: [0, 20, 0, 10],
      },
      {
        table: {
          widths: ["auto", "auto", "auto", "auto", "auto", "auto", "auto","auto"],
          body: [
            [
              "ID",
              "Reference",
              "designation",
              "code_Article",
              "vitrage",
              "hauteur",
              "largeur",
              "Phase",
            ],
            ...elements.map((element) => [
              element.id || "",
              element.reference || "",
              element.designation || "",
              element.code_Article || "",
              element.vitrage || "",
              
              element.hauteur || "",
              element.largeur || "",
              element.phase || "",
            ]),
          ],
        },
        layout: {
          fillColor: function (rowIndex, node, columnIndex) {
            return rowIndex === 0 ? "#CCCCCC" : null;
          },
        },
        margin: [0, 0, 0, 20],
      },
    ],
    styles: {
      header: {
        fontSize: 20,
        bold: true,
        margin: [0, 0, 0, 20],
        font: "Roboto",
      },
      description: {
        fontSize: 14,
        margin: [0, 0, 0, 10],
        font: "Roboto",
      },
    },
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  const filePath = path.join(
    "public",
    "pdfs",
    "rapport_compte_rendu_chantier.pdf"
  );
  pdfDoc.pipe(fs.createWriteStream(filePath));
  pdfDoc.end();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=rapport_compte_rendu_chantier.pdf"
  );
  const filestream = fs.createReadStream(filePath);
  filestream.pipe(res);
};
