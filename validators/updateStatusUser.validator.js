const { body } = require("express-validator");

const validateUpdateStatusUser = [
  body("status")
    .isLength({ max: 20 })
    .withMessage("Status tidak boleh lebih dari 60 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Status tidak boleh kosong"),
];

module.exports = {
  validateUpdateStatusUser,
};
