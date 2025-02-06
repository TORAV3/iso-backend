const { body } = require("express-validator");

const validateSection = [
  body("value").trim().notEmpty().withMessage("Bab tidak boleh kosong"),
  body("classId").trim().notEmpty().withMessage("Data Bab tidak boleh kosong"),
];

module.exports = {
  validateSection,
};
