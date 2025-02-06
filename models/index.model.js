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
const classModel = require("./classModel.model")(sequelize, Sequelize);
const topic = require("./topic.model")(sequelize, Sequelize);
const section = require("./section.model")(sequelize, Sequelize);
const subsection = require("./subsection.model")(sequelize, Sequelize);
const intquestion = require("./intquestion.model")(sequelize, Sequelize);
const test = require("./test.model")(sequelize, Sequelize);
const soal = require("./soal.model")(sequelize, Sequelize);
const jawaban = require("./jawaban.model")(sequelize, Sequelize);
const jawabanBenar = require("./jawabanBenar.model")(sequelize, Sequelize);

user.associate({ userDetail, role, access });
userDetail.associate({ user });
access.associate({ user });
role.associate({ user });
classModel.associate({ topic, section, test });
topic.associate({ classModel });
section.associate({ classModel, subsection });
subsection.associate({ section });
test.associate({ classModel, soal });
soal.associate({ test, jawaban, jawabanBenar });
jawaban.associate({ soal });
jawabanBenar.associate({ soal });

module.exports = {
  sequelize,
  user,
  userDetail,
  role,
  access,
  classModel,
  topic,
  section,
  subsection,
  intquestion,
  test,
  soal,
  jawaban,
  jawabanBenar,
};
