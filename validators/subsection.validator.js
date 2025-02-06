const { body } = require("express-validator");

const validateSubsection = [
  body("value").trim().notEmpty().withMessage("Sub bab tidak boleh kosong"),
  body("sectionId")
    .trim()
    .notEmpty()
    .withMessage("Data Bab tidak boleh kosong"),
  body("materi")
    .trim()
    .notEmpty()
    .withMessage("Materi sub bab tidak boleh kosong"),
];

module.exports = {
  validateSubsection,
};
