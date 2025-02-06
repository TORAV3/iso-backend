const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const {
  badRequestResponse,
  successCreatedResponse,
  internalServerErrorResponse,
  notfoundResponse,
  successResponse,
} = require("../configs/response");
const { user, userDetail, role, access } = require("../models/index.model");

const registerController = async (req, res, startTime) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const { fullname, email, phone, password, type } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userCreated = await user.create({
      fullname,
      email,
      phone,
      password: hashedPassword,
      type,
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

const loginController = async (req, res, startTime) => {
  const { email, password } = req.body;

  try {
    const userData = await user.findOne({
      where: {
        email,
      },
    });

    if (!userData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Akun belum terdaftar", timeExecution);
    }

    if (!bcrypt.compare(password, userData.password)) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Akun belum terdaftar", timeExecution);
    }

    const token = jwt.sign(
      {
        id: userData.id,
      },
      process.env.JWTSECRET,
      {
        expiresIn: "1h",
      }
    );

    const timeExecution = Date.now() - startTime;
    return successResponse(res, token, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getLoginDataController = async (req, res) => {
  const startTime = Date.now();

  const { id } = req.userLoginData;

  try {
    const userData = await user.findOne({
      where: {
        id,
      },
    });

    if (!userData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "User tidak ditemukan", timeExecution);
    }

    if (userData.type === "student") {
      try {
        const userData = await user.findOne({
          where: {
            id,
          },
          include: [
            {
              model: userDetail,
            },
          ],
        });

        if (!userData) {
          const timeExecution = Date.now() - startTime;
          return notfoundResponse(res, "User tidak ditemukan", timeExecution);
        }

        if (userData.status !== "register") {
          const userPlain = userData.toJSON();

          const encodeFileToBase64 = (fileName, folderId) => {
            if (!fileName) return null;
            const userFolderPath = path.join(
              __dirname,
              "../public/upload",
              folderId.toString()
            );
            const filePath = path.join(userFolderPath, fileName);

            if (fs.existsSync(filePath)) {
              const fileBuffer = fs.readFileSync(filePath);
              return `data:image/${path
                .extname(fileName)
                .slice(1)};base64,${fileBuffer.toString("base64")}`;
            }
            return null;
          };

          userPlain.userDetail.pasFotoBase64 = encodeFileToBase64(
            userPlain.userDetail.pasFoto,
            id
          );

          const timeExecution = Date.now() - startTime;
          return successResponse(res, userPlain, timeExecution);
        }

        const timeExecution = Date.now() - startTime;
        return successResponse(res, userData, timeExecution);
      } catch (error) {
        console.log(error);
        const timeExecution = Date.now() - startTime;
        return internalServerErrorResponse(res, timeExecution);
      }
    } else {
      try {
        const userData = await user.findOne({
          where: {
            id,
          },
          include: [
            {
              model: role,
            },
            {
              model: access,
            },
          ],
        });

        if (!userData) {
          const timeExecution = Date.now() - startTime;
          return notfoundResponse(res, "User tidak ditemukan", timeExecution);
        }

        const timeExecution = Date.now() - startTime;
        return successResponse(res, userData, timeExecution);
      } catch (error) {
        console.log(error);
        const timeExecution = Date.now() - startTime;
        return internalServerErrorResponse(res, timeExecution);
      }
    }
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

module.exports = {
  registerController,
  loginController,
  getLoginDataController,
};
