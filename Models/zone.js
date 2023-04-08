const Sequelize = require('sequelize')

const Db = require("../db/dbConnect.js")


const {DataTypes} = Sequelize

const Element = require("../Models/element")


class Zone extends Sequelize.Model {}

Zone.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  x: {
    type: DataTypes.DECIMAL,
    // allowNull: false,
  },
  y: {
    type: DataTypes.DECIMAL,
    // allowNull: false,
  },
  width: {
    type: DataTypes.DECIMAL,
    // allowNull: false,
  },
  height: {
    type: DataTypes.DECIMAL,
    // allowNull: false,
  }
},{
    modelName: "Zone",
    tableName: "Zone",
    sequelize: Db,
  });


module.exports = Zone;



