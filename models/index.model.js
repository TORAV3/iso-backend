const Sequelize = require("sequelize");
const config = require("../configs/database");

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: config.development.dialect,
  }
);

const user = require("./user.model")(sequelize, Sequelize);

module.exports = {
  sequelize,
  user,
};
