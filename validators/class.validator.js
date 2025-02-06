const { body } = require("express-validator");

const validateCreateClass = [
  body("title")
    .isLength({ max: 80 })
    .withMessage("Nama kelas tidak boleh lebih dari 80 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Nama kelas tidak boleh kosong"),
  body("subtitle")
    .isLength({ max: 150 })
    .withMessage("Deskripsi singkat kelas tidak boleh lebih dari 150 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Deskripsi singkat kelas tidak boleh kosong"),
  body("mentorId").trim().notEmpty().withMessage("Mentor tidak boleh kosong"),
  body("duration")
    .trim()
    .notEmpty()
    .withMessage("Durasi kelas tidak boleh kosong"),
  body("level").trim().notEmpty().withMessage("Level kelas tidak boleh kosong"),
  body("month").trim().notEmpty().withMessage("Lama kelas tidak boleh kosong"),
  body("format")
    .trim()
    .notEmpty()
    .withMessage("Format kelas tidak boleh kosong"),
  body("type").trim().notEmpty().withMessage("Tipe kelas tidak boleh kosong"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Deskripsi kelas tidak boleh kosong"),
  body("thumbnail")
    .trim()
    .notEmpty()
    .withMessage("Thumbnail kelas tidak boleh kosong"),
];
const validateUpdateClass = [
  body("title")
    .isLength({ max: 80 })
    .withMessage("Nama kelas tidak boleh lebih dari 80 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Nama kelas tidak boleh kosong"),
  body("subtitle")
    .isLength({ max: 150 })
    .withMessage("Deskripsi singkat kelas tidak boleh lebih dari 150 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Deskripsi singkat kelas tidak boleh kosong"),
  body("mentorId").trim().notEmpty().withMessage("Mentor tidak boleh kosong"),
  body("duration")
    .trim()
    .notEmpty()
    .withMessage("Durasi kelas tidak boleh kosong"),
  body("level").trim().notEmpty().withMessage("Level kelas tidak boleh kosong"),
  body("month").trim().notEmpty().withMessage("Lama kelas tidak boleh kosong"),
  body("format")
    .trim()
    .notEmpty()
    .withMessage("Format kelas tidak boleh kosong"),
  body("type").trim().notEmpty().withMessage("Tipe kelas tidak boleh kosong"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Deskripsi kelas tidak boleh kosong"),
];
const validateUpdateStatusClass = [
  body("status")
    .isLength({ max: 1 })
    .withMessage("Status tidak boleh lebih dari 1 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Status tidak boleh kosong"),
];

module.exports = {
  validateCreateClass,
  validateUpdateClass,
  validateUpdateStatusClass,
};
