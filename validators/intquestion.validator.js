const { body } = require("express-validator");

const validateUpdateStatusInterviewQuestion = [
  body("status")
    .isLength({ max: 1 })
    .withMessage("Status tidak boleh lebih dari 1 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Status tidak boleh kosong"),
];

const validateUpdateInterviewQuestion = [
  body("question")
    .isLength({ max: 200 })
    .withMessage("Nama lengkap tidak boleh lebih dari 200 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Nama lengkap tidak boleh kosong"),
];

const validateAddInterviewQuestion = [
  body("question")
    .isLength({ max: 200 })
    .withMessage("Nama lengkap tidak boleh lebih dari 200 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Nama lengkap tidak boleh kosong"),
];

module.exports = {
  validateUpdateStatusInterviewQuestion,
  validateUpdateInterviewQuestion,
  validateAddInterviewQuestion,
};
