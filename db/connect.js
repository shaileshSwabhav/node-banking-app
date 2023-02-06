require("dotenv").config()
const { Sequelize } = require("sequelize")

const db = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  dialect: process.env.DB_DIALECT,
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  logging: console.log,
})

module.exports = db
