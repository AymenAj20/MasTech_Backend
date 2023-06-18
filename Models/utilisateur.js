const Sequelize = require('sequelize')
const Tache = require('../Models/tache')
const Chantier = require('../Models/chantier')

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
    email : {
        type : DataTypes.STRING,
        // allowNull :false
    },
    imageURL : {
        type : DataTypes.STRING,
        // allowNull :false
    },
    numTel : {
        type : DataTypes.STRING,
        // allowNull :false
    },
    passwordHash : {
        type : DataTypes.STRING,
        // allowNull :false
    },
    cin : {
        type : DataTypes.STRING,
        // allowNull :false
    },
    note : {
        type : DataTypes.STRING,
        // allowNull :false
    },
    role : {
        type : DataTypes.STRING ,
        type : DataTypes.ENUM,
        values : ['Admin','chefProjet','chefChantier']
        // allowNull :false
    }

},{
        modelName: 'Utilisateur',
        tableName: 'utilisateur',
        sequelize: Db,
    }
)

Utlisateur.hasMany(Tache);
Utlisateur.hasMany(Chantier, { onDelete: "RESTRICT" });



module.exports = Utlisateur