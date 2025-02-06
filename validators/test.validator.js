const { body } = require("express-validator");

const validateUpdateStatusTest = [
  body("status")
    .isLength({ max: 1 })
    .withMessage("Status tidak boleh lebih dari 1 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Status tidak boleh kosong"),
];

const validateUpdateTest = [
  body("classId")
    .trim()
    .notEmpty()
    .withMessage("Kelas tidak boleh tidak dipilih"),
];

const validateAddTest = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Judul tes tidak boleh tidak dipilih"),
  body("desc")
    .trim()
    .notEmpty()
    .withMessage("Deskripsi tes tidak boleh tidak dipilih"),
  body("classId")
    .trim()
    .notEmpty()
    .withMessage("Kelas tidak boleh tidak dipilih"),
];

module.exports = {
  validateUpdateStatusTest,
  validateUpdateTest,
  validateAddTest,
};
