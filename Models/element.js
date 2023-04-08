const Sequelize = require('sequelize')

const Db = require("../db/dbConnect.js")


const {DataTypes} = Sequelize

const Zone = require("../Models/zone")

class Element extends Sequelize.Model {}

Element.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  hauteur: {
    type: DataTypes.DECIMAL,
    // allowNull: false,
  },
  designation: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
  code_Article: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
  largeur: {
    type: DataTypes.STRING,
    // allowNull: true,
  },
  reference: {
    type: DataTypes.STRING,
    // allowNull: true,
  },
  surface: {
    type: DataTypes.STRING,
    // allowNull: true,
  },
  couleur: {
    type: DataTypes.STRING,
    // allowNull: true,
  },
  gamme: {
    type: DataTypes.STRING,
    // allowNull: true,
  },
  serie: {
    type: DataTypes.STRING,
    // allowNull: true,
  },
  vitrage: {
    type: DataTypes.STRING,
    // allowNull: true,
  },
  unite: {
    type: DataTypes.STRING,
    // allowNull: true,
  },
  qte: {
    type: DataTypes.STRING,
    // allowNull: true,
  },
  lot: {
    type: DataTypes.STRING,
    // allowNull: true,
  },
  phase: {
    type: DataTypes.STRING,
    // allowNull: true,
  },
  etat: {//fabrication,ou autres
    type: DataTypes.STRING,
    // allowNull: true,
  },
  affecte: {//affecté a une zone ou pas
    type: DataTypes.BOOLEAN,
    // allowNull: true,
  },
  
  
},{
  modelName: "Element",
  tableName: "Element",
  sequelize: Db,
});


Element.hasOne(Zone);


module.exports = Element;
