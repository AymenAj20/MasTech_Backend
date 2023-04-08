const Sequelize = require('sequelize')
const ChefProjet = require('../Models/chefProjet')

const Db = require("../db/dbConnect.js")


const {DataTypes} = Sequelize
class Utlisateur extends Sequelize.Model {}

Utlisateur.init({
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
    type : {
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
    }},{
        modelName: 'Utilisateur',
        tableName: 'utilisateur',
        sequelize: Db,
    }
)



module.exports = Utlisateur