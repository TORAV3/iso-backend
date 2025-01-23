const { body } = require("express-validator");

const validatePostUserAccess = [
  body("fullname")
    .isLength({ max: 40 })
    .withMessage("Nama lengkap tidak boleh lebih dari 40 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Nama lengkap tidak boleh kosong"),
  body("username")
    .isLength({ max: 20 })
    .withMessage("Username tidak boleh lebih dari 20 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Username tidak boleh kosong"),
  body("email")
    .isLength({ max: 30 })
    .withMessage("Email tidak boleh lebih dari 30 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Email tidak boleh kosong"),
  body("roleId")
    .trim()
    .notEmpty()
    .withMessage("Role tidak boleh kosong")
    .isNumeric()
    .withMessage("Role harus berupa angka"),
  body("password").trim().notEmpty().withMessage("Password tidak boleh kosong"),
];

const validatePutUserAccess = [
  body("fullname")
    .isLength({ max: 40 })
    .withMessage("Nama lengkap tidak boleh lebih dari 40 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Nama lengkap tidak boleh kosong"),
  body("phone")
    .isLength({ max: 15 })
    .withMessage("No. HP tidak boleh lebih dari 15 karakter.")
    .trim()
    .notEmpty()
    .withMessage("No. HP tidak boleh kosong"),
  body("email")
    .isLength({ max: 30 })
    .withMessage("Email tidak boleh lebih dari 30 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Email tidak boleh kosong"),
  body("roleId")
    .trim()
    .notEmpty()
    .withMessage("Role tidak boleh kosong")
    .isNumeric()
    .withMessage("Role harus berupa angka"),
];

const validateUpdateStatusUserAccess = [
  body("status")
    .isLength({ max: 1 })
    .withMessage("Status tidak boleh lebih dari 1 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Status tidak boleh kosong"),
];

module.exports = {
  validatePostUserAccess,
  validatePutUserAccess,
  validateUpdateStatusUserAccess,
};
