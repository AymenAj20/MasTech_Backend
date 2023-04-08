const sequelize = require("sequelize");
const Utlisateur = require("./utilisateur.js");
const Db = require("../db/dbConnect.js");
const { DataTypes } = sequelize;

const Tache = require("../Models/tache");

class ChefChantier extends Utlisateur {
  // changed from Sequelize.Model
}
ChefChantier.init(
  {
    id : {
      type : DataTypes.INTEGER.UNSIGNED,
      primaryKey : true,
      autoIncrement : true,
      allowNull :false,
  },
  nom : {
      type : DataTypes.STRING,
      // allowNull :false
  },
  prenom : {
      type : DataTypes.STRING,
      // allowNull :false
  },
  imageURL : {
      type : DataTypes.STRING,
      // allowNull :false
  },
  numTel : {
      type : DataTypes.DECIMAL,
      // allowNull :false
  },
  password : {
      type : DataTypes.STRING,
      // allowNull :false
  },
  cin : {
      type : DataTypes.STRING,
      // allowNull :false
  },
  },
  {
    modelName: "chefChantier",
    tableName: "chefChantier",
    sequelize: Db,
  }
);

ChefChantier.hasMany(Tache);

// ChefProjet.hasMany(Projet, { onDelete: "RESTRICT" });

module.exports = ChefChantier;
