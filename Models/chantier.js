const Sequelize = require("sequelize");

const Db = require("../db/dbConnect.js");

const { DataTypes } = Sequelize;

const Etage = require("./etage.js");
const Tache = require("./tache.js");
const User = require("./utilisateur");

const Chantier = Db.define("Chantier", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  codeChantier: {
    //Villa / chantier
    type: DataTypes.STRING,
    allowNull: false,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lieu: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    //Villa / chantier
    type: DataTypes.STRING,
    allowNull: false,
  },
  percentAvancement: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  percentElaboration: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  percentEstimation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  percentFabrication: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categorie: {
    //local / export
    type: DataTypes.STRING,
    allowNull: false,
  },
  etat: {
    //termine / enCours
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date_debut: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  date_fin: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

Chantier.associate = (models) => {
  Chantier.belongsTo(models.User, {
    onDelete: "RESTRICT",
  });
};

Chantier.hasMany(Etage, {
  onDelete: "CASCADE",
});
Chantier.hasMany(Tache, { onDelete: "CASCADE" });

module.exports = Chantier;
