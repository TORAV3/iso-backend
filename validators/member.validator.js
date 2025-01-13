const { body } = require("express-validator");

const validateMemberRegister = [
  body("trainbef")
    .trim()
    .notEmpty()
    .withMessage(
      "Pertanyaan mengenai pernah mengikuti training sebelumnya tidak boleh kosong"
    ),
  body("nik")
    .isLength({ max: 16 })
    .withMessage("NIK tidak boleh lebih dari 16 karakter.")
    .trim()
    .notEmpty()
    .withMessage("NIK tidak boleh kosong")
    .isNumeric()
    .withMessage("NIK harus berupa angka"),
  body("gender")
    .isLength({ max: 1 })
    .withMessage("Gender tidak boleh lebih dari 1 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Gender tidak boleh kosong"),
  body("religion")
    .isLength({ max: 10 })
    .withMessage("Agama tidak boleh lebih dari 10 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Agama tidak boleh kosong"),
  body("birthplace")
    .isLength({ max: 40 })
    .withMessage("Tempat lahir tidak boleh lebih dari 40 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Tempat lahir tidak boleh kosong"),
  body("birthdate")
    .trim()
    .notEmpty()
    .withMessage("Tempat lahir tidak boleh kosong")
    .isISO8601({ strict: true })
    .withMessage("Format tanggal tidak valid, gunakan YYYY-MM-DD"),
  body("height")
    .isLength({ max: 3 })
    .withMessage("Tinggi badan tidak boleh lebih dari 3 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Tinggi badan tidak boleh kosong")
    .isNumeric()
    .withMessage("Tinggi badan harus berupa angka"),
  body("weight")
    .isLength({ max: 3 })
    .withMessage("Berat badan tidak boleh lebih dari 3 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Berat badan tidak boleh kosong")
    .isNumeric()
    .withMessage("Berat badan harus berupa angka"),
  body("city")
    .isLength({ max: 30 })
    .withMessage("Kota tidak boleh lebih dari 30 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Kota tidak boleh kosong"),
  body("address").trim().notEmpty().withMessage("Alamat tidak boleh kosong"),
  body("lastedu")
    .isLength({ max: 5 })
    .withMessage("Tinggi badan tidak boleh lebih dari 5 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Pendidikan terakhir tidak boleh kosong"),
  body("program")
    .isLength({ max: 10 })
    .withMessage("Program tidak boleh lebih dari 10 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Pendidikan terakhir tidak boleh kosong"),
  body("dadName")
    .isLength({ max: 60 })
    .withMessage("Nama ayah tidak boleh lebih dari 60 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Nama ayah tidak boleh kosong"),
  body("dadPhone")
    .isLength({ max: 14 })
    .withMessage("Nomor telepon ayah tidak boleh lebih dari 14 karakter.")
    .trim()
    .notEmpty()
    .withMessage("No. telp ayah tidak boleh kosong")
    .matches(/^(?:\+62|62|0)[2-9][0-9]{7,11}$/)
    .withMessage("No. telp ayah tidak valid"),
  body("dadAddress")
    .trim()
    .notEmpty()
    .withMessage("Alamat ayah tidak boleh kosong"),
  body("momName")
    .isLength({ max: 60 })
    .withMessage("Nama ibu tidak boleh lebih dari 60 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Nama ibu tidak boleh kosong"),
  body("momPhone")
    .isLength({ max: 14 })
    .withMessage("Nomor telepon ibu tidak boleh lebih dari 14 karakter.")
    .trim()
    .notEmpty()
    .withMessage("No. telp ibu tidak boleh kosong")
    .matches(/^(?:\+62|62|0)[2-9][0-9]{7,11}$/)
    .withMessage("No. telp ibu tidak valid"),
  body("momAddress")
    .trim()
    .notEmpty()
    .withMessage("Alamat ibu tidak boleh kosong"),
  body("kinsmanName")
    .isLength({ max: 60 })
    .withMessage("Nama kerabat tidak boleh lebih dari 60 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Nama kerabat tidak boleh kosong"),
  body("kinsmanPhone")
    .isLength({ max: 14 })
    .withMessage("Nomor telepon kerabat tidak boleh lebih dari 14 karakter.")
    .trim()
    .notEmpty()
    .withMessage("No. telp kerabat tidak boleh kosong")
    .matches(/^(?:\+62|62|0)[2-9][0-9]{7,11}$/)
    .withMessage("No. telp kerabat tidak valid"),
  body("kinsmanAddress")
    .trim()
    .notEmpty()
    .withMessage("Alamat kerabat tidak boleh kosong"),
  body("pasFoto").trim().notEmpty().withMessage("Pas foto tidak boleh kosong"),
  body("fullBodyFoto")
    .trim()
    .notEmpty()
    .withMessage("Foto full body tidak boleh kosong"),
  body("ktp").trim().notEmpty().withMessage("KTP tidak boleh kosong"),
  body("kk").trim().notEmpty().withMessage("KK tidak boleh kosong"),
  body("akta")
    .trim()
    .notEmpty()
    .withMessage("Akta kelahiran tidak boleh kosong"),
  body("ijazah")
    .trim()
    .notEmpty()
    .withMessage("Ijazah terakhir tidak boleh kosong"),
  body("sks")
    .trim()
    .notEmpty()
    .withMessage("Surat keterangan sehat tidak boleh kosong"),
];

module.exports = {
  validateMemberRegister,
};
