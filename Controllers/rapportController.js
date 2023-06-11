const pdfMake = require('pdfmake');
const fs = require('fs');
const path = require('path');

// Définir les fichiers de police
var fonts = {
  Roboto: {
    normal: 'helpers/assets/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'helpers/assets/fonts/Roboto/Roboto-Medium.ttf',
    italics: 'helpers/assets/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics: 'helpers/assets/fonts/Roboto/Roboto-MediumItalic.ttf'
  }
};

const printer = new pdfMake(fonts);

exports.generateRapport = function (req, res) {
  const { projet } = req.body;

  // Exemple de données de suivi de chantier
  const donnees = {
    responsable: 'John Doe',
    dateDebut: '2023-05-01',
    dateFin: '2023-05-15',
    avancement: '60%',
    budget: {
      total: 1000000,
      depenses: 600000,
      restant: 400000
    }
  };

  // Exemple de tableau de suivi de chantier
  const tableauSuivi = [
    ['Tâche', 'Responsable', 'Statut'],
    ['Préparation du site', 'Jane Smith', 'Terminé'],
    ['Fondations', 'John Doe', 'En cours'],
    ['Maçonnerie', 'Bob Johnson', 'À venir']
  ];

  // Définir le contenu du document PDF
  const docDefinition = {
    header: {
      margin: [30, 20, 0, 0],
      columns: [
        {
          image: 'helpers/assets/mas.jpeg',
          fit: [50, 50],
          alignment: 'left'
        },
        {
          text: 'Rapport de compte rendu pour Chef de Projet',
          alignment: 'center',
          fontSize: 16,
          bold: true
        }
      ]
    },
    footer: function (currentPage, pageCount) {
      return {
        text: 'Page ' + currentPage.toString() + ' / ' + pageCount,
        alignment: 'center',
        margin: [0, 0, 0, 20]
      };
    },
    content: [
      {
        text: 'Projet : ' + projet,
        style: 'header',
        alignment: 'center'
      },
      {
        text: 'Responsable du suivi : ' + donnees.responsable,
        style: 'description'
      },
      {
        text: 'Période du suivi : ' + donnees.dateDebut + ' - ' + donnees.dateFin,
        style: 'description'
      },
      {
        text: 'Avancement : ' + donnees.avancement,
        style: 'description',
        margin: [0, 0, 0, 20]
      },
      {
        table: {
          widths: ['auto', 'auto', 'auto'],
          body: tableauSuivi
        },
        layout: {
          fillColor: function (rowIndex, node, columnIndex) {
            return (rowIndex === 0) ? '#CCCCCC' : null;
          }
        },
        margin: [0, 0, 0, 20]
      },
      {
        text: 'Budget',
        style: 'header',
        alignment: 'center'
      },
      {
        text: 'Total : $' + donnees.budget.total,
        style: 'description'
      },
      {
        text: 'Dépenses : $' + donnees.budget.depenses,
        style: 'description'
      },
      {
        text: 'Restant : $' + donnees.budget.restant,
        style: 'description'
      }
    ],
    styles: {
      header: {
        fontSize: 20,
        bold: true,
        margin: [0, 0, 0, 20], // [gauche, haut, droite, bas]
        font: 'Roboto'
      },
      description: {
        fontSize: 14,
        margin: [0, 0, 0, 10], // [gauche, haut, droite, bas]
        font: 'Roboto'
      }
    }
  };

  // Créer le document PDF
  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  // Définir le chemin du PDF
  const filePath = path.join('public/pdfs', 'rapport_compte_rendu_chantier.pdf');

  // Écrire le PDF dans le chemin
  pdfDoc.pipe(fs.createWriteStream(filePath));
  pdfDoc.end();

  // Envoyer le PDF en tant que réponse
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=rapport_compte_rendu_chantier.pdf');
  const filestream = fs.createReadStream(filePath);
  filestream.pipe(res);
};
