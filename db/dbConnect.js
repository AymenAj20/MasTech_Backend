const { Sequelize } = require('sequelize')

require('dotenv/config')


const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD

module.exports = new Sequelize('PFE_DB',DB_USER,DB_PASSWORD,{dialect:'mysql',host:'localhost',port:'3308'})