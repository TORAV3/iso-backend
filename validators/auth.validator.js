const { body } = require("express-validator");

const validateRegister = [
  body("fullname")
    .isLength({ max: 60 })
    .withMessage("Nama lengkap tidak boleh lebih dari 60 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Nama lengkap tidak boleh kosong"),
  body("email")
    .isLength({ max: 60 })
    .withMessage("Email tidak boleh lebih dari 60 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Email tidak boleh kosong"),
  body("phone")
    .isLength({ max: 14 })
    .withMessage("Nomor telepon tidak boleh lebih dari 14 karakter.")
    .trim()
    .notEmpty()
    .withMessage("No. telp tidak boleh kosong"),
  body("password").trim().notEmpty().withMessage("Password tidak boleh kosong"),
];

const validateLogin = [
  body("email")
    .isLength({ max: 60 })
    .withMessage("Email tidak boleh lebih dari 60 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Email tidak boleh kosong"),
  body("password").trim().notEmpty().withMessage("Password tidak boleh kosong"),
];

module.exports = {
  validateRegister,
  validateLogin,
};
