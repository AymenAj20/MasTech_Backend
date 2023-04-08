const Sequelize = require('sequelize')

const Db = require("../db/dbConnect.js")


const {DataTypes} = Sequelize



const Tache = Db.define("Tache", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  titre: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    // allowNull: true,
  },
  type: {//Normal ou rectification
    type: DataTypes.STRING,
    // allowNull: true,
  },
  etat: {//Achevé ou non
    type: DataTypes.BOOLEAN,// chef chantirer 
    // allowNull: true,
  },
  statut: {//Validé ou non
    type: DataTypes.BOOLEAN,// chef projet
    // allowNull: true,
  },
  dateFin: {
    type: DataTypes.DATE,
    //allowNull: true,
  },
});



module.exports = Tache;
