const sequelize = require("sequelize");
const Utlisateur = require("./utilisateur.js");
const Db = require("../db/dbConnect.js");
const { DataTypes } = sequelize;

const Chantier = require("../Models/chantier.js");

class ChefProjet extends Utlisateur {
  // changed from Sequelize.Model
}
ChefProjet.init(
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
    modelName: "chefProjet",
    tableName: "chefProjet",
    sequelize: Db,
  }
);


ChefProjet.hasMany(Chantier, { onDelete: "RESTRICT" });

module.exports = ChefProjet;
