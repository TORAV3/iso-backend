const { body } = require("express-validator");

const validateAdminLogin = [
  body("username")
    .isLength({ max: 20 })
    .withMessage("Username tidak boleh lebih dari 20 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Username tidak boleh kosong"),
  body("password").trim().notEmpty().withMessage("Password tidak boleh kosong"),
];

module.exports = {
  validateAdminLogin,
};
