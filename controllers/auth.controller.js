const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const {
  badRequestResponse,
  successCreatedResponse,
  internalServerErrorResponse,
} = require("../configs/response");
const { user } = require("../models/index.model");

const registerController = async (req, res, startTime) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const { fullname, email, phone, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userCreated = await user.create({
      fullname,
      email,
      phone,
      password: hashedPassword,
    });

    const timeExecution = Date.now() - startTime;
    return successCreatedResponse(
      res,
      "Proses pendaftaran berhasil",
      timeExecution
    );
  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
      let fieldName;
      const field = error.errors[0].path;
      switch (field) {
        case "fullname":
          fieldName = "Nama Lengkap";
          break;
        case "email":
          fieldName = "Email";
          break;
        case "phone":
          fieldName = "No. Telp";
          break;
        default:
          fieldName = field;
          break;
      }
      const value = error.errors[0].value;
      const timeExecution = Date.now() - startTime;
      return badRequestResponse(
        res,
        `Data '${value}' pada '${fieldName}' sudah terdaftar.`,
        timeExecution
      );
    }

    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

module.exports = {
  registerController,
};
