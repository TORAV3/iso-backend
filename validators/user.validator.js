const { body } = require("express-validator");

const validateUpdateStatusUser = [
  body("status")
    .isLength({ max: 20 })
    .withMessage("Status tidak boleh lebih dari 60 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Status tidak boleh kosong"),
];

const validateUpdateInternalUser = [
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
    .withMessage("No. telp tidak boleh kosong")
    .matches(/^(?:\+62|62|0)[2-9][0-9]{7,11}$/)
    .withMessage("No. telp tidak valid"),
  body("roleId").trim().notEmpty().withMessage("Role tidak boleh kosong"),
];

const validateAddInternalUser = [
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
    .withMessage("No. telp tidak boleh kosong")
    .matches(/^(?:\+62|62|0)[2-9][0-9]{7,11}$/)
    .withMessage("No. telp tidak valid"),
  body("password").trim().notEmpty().withMessage("Password tidak boleh kosong"),
  body("roleId").trim().notEmpty().withMessage("Role tidak boleh kosong"),
];

const validateUpdateStatusInternalUser = [
  body("status")
    .isLength({ max: 1 })
    .withMessage("Status tidak boleh lebih dari 60 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Status tidak boleh kosong"),
];

module.exports = {
  validateUpdateStatusUser,
  validateUpdateInternalUser,
  validateAddInternalUser,
  validateUpdateStatusInternalUser,
};
