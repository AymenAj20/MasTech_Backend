const Sequelize = require('sequelize')

const Db = require("../db/dbConnect.js")


const {DataTypes} = Sequelize

const Zone = require("../Models/zone");

const Plan = Db.define("Plan", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    // data: {
    //   type: DataTypes.BLOB,
    //   allowNull: true,
    // },
  });
  
  


  
  module.exports = Plan;