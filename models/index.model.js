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
const userDetail = require("./userDetail.model")(sequelize, Sequelize);
const access = require("./access.model")(sequelize, Sequelize);
const role = require("./role.model")(sequelize, Sequelize);

user.associate({ userDetail, role, access });
userDetail.associate({ user });
access.associate({ user });
role.associate({ user });

module.exports = {
  sequelize,
  user,
  userDetail,
  role,
  access,
};
