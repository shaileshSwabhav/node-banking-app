
const sequelize = require("./db/connect")

const dbConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log("db successfully connected");
  } catch (error) {
    console.error(error);
    await sequelize.close()
  }
}

module.exports = { dbConnection }