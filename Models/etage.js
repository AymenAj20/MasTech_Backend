const Sequelize = require('sequelize')

const Db = require("../db/dbConnect.js")


const {DataTypes} = Sequelize

const Element = require("./element.js");
const Plan = require('./plan.js');

const Etage = Db.define("Etage", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  numero: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Etage.hasMany(Element, {
  onDelete: "CASCADE",
});
Etage.hasOne(Plan, {
  onDelete: "CASCADE",
});

module.exports = Etage;
