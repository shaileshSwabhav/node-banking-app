require("dotenv").config()

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    ssl: true,
    // replication: true,
    pool: {
      max: 2,
      min: 1,
      idle: 10000,
    },
    logQueryParameters: true,
    typeValidation: true,
    // hooks: {
    // }
    // default is console.log
    // logging: (...message) => console.debug(message[0]),
  }
}