const { body } = require("express-validator");

const validateTopic = [
  body("value").trim().notEmpty().withMessage("Topik tidak boleh kosong"),
  body("classId")
    .trim()
    .notEmpty()
    .withMessage("Data Topik tidak boleh kosong"),
];

module.exports = {
  validateTopic,
};
