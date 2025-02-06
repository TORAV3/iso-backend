const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const { Sequelize } = require("sequelize");
const { user, userDetail } = require("../models/index.model");
const {
  internalServerErrorResponse,
  successResponse,
  notfoundResponse,
  successCreatedResponse,
  badRequestResponse,
} = require("../configs/response");

const getAllStudentUserController = async (req, res) => {
  const startTime = Date.now();
  try {
    const { status } = req.query;

    let users;

    if (
      status === "reviewed" ||
      status === "revisi" ||
      status === "register" ||
      status === "approve" ||
      status === "reject"
    ) {
      users = await user.findAll({
        where: {
          type: "student",
          status,
        },
      });
    } else {
      users = await user.findAll({
        where: {
          type: "student",
        },
      });
    }

    const timeExecution = Date.now() - startTime;
    return successResponse(res, users, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getAllInternalUserController = async (req, res) => {
  const startTime = Date.now();
  try {
    const { status } = req.query;

    let users;

    if (status === "all") {
      users = await user.findAll({
        where: {
          type: "internal",
        },
        include: ["role"],
      });
    } else {
      users = await user.findAll({
        where: {
          type: "internal",
          activeStatus: status,
        },
        include: ["role"],
      });
    }

    const timeExecution = Date.now() - startTime;
    return successResponse(res, users, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getStudentUserByIdController = async (req, res) => {
  const startTime = Date.now();

  const { id } = req.params;

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

      userPlain.userDetail.ktpBase64 = encodeFileToBase64(
        userPlain.userDetail.ktp,
        id
      );
      userPlain.userDetail.kkBase64 = encodeFileToBase64(
        userPlain.userDetail.kk,
        id
      );
      userPlain.userDetail.pasFotoBase64 = encodeFileToBase64(
        userPlain.userDetail.pasFoto,
        id
      );
      userPlain.userDetail.fullBodyFotoBase64 = encodeFileToBase64(
        userPlain.userDetail.fullBodyFoto,
        id
      );
      userPlain.userDetail.aktaBase64 = encodeFileToBase64(
        userPlain.userDetail.akta,
        id
      );
      userPlain.userDetail.ijazahBase64 = encodeFileToBase64(
        userPlain.userDetail.ijazah,
        id
      );
      userPlain.userDetail.sksBase64 = encodeFileToBase64(
        userPlain.userDetail.sks,
        id
      );
      userPlain.userDetail.vaksinBase64 = encodeFileToBase64(
        userPlain.userDetail.vaksin,
        id
      );
      userPlain.userDetail.sertifikatBase64 = encodeFileToBase64(
        userPlain.userDetail.sertifikat,
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
};

const getInternalUserByIdController = async (req, res) => {
  const startTime = Date.now();

  const { id } = req.params;

  try {
    const userData = await user.findOne({
      where: {
        id,
      },
      include: ["role", "access"],
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
};

const getStudentUserFileByIdController = async (req, res) => {
  const startTime = Date.now();

  const { id, column } = req.params;

  try {
    const userData = await userDetail.findOne({
      attributes: [column],
      where: {
        userId: id,
      },
    });

    if (!userData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "File tidak ditemukan", timeExecution);
    }

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

    userPlain[column] = encodeFileToBase64(userPlain[column], id);

    const timeExecution = Date.now() - startTime;
    return successResponse(res, userPlain, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const updateStatusUserByIdController = async (req, res, startTime) => {
  const { id } = req.params;

  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const { status } = req.body;

  try {
    const userData = await user.findOne({
      where: {
        id,
      },
    });

    if (!userData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Data user tidak ditemukan", timeExecution);
    }

    userData.status = status;

    await userData.save();

    const timeExecution = Date.now() - startTime;
    return successResponse(res, "Berhasil mengubah status user", timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const addInternalUserController = async (req, res, startTime) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const {
    fullname,
    username,
    email,
    phone,
    password,
    roleId,
    muser,
    usaccess,
    mkelas,
    mintquestion,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userCreated = await user.create(
      {
        fullname,
        email,
        phone,
        password: hashedPassword,
        roleId,
        type: "internal",
        access: {
          muser,
          usaccess,
          mkelas,
          mintquestion,
        },
      },
      { include: ["access"] }
    );

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
          fieldName = "No. HP";
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

const updateInternalUserController = async (req, res, startTime) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const {
    fullname,
    username,
    email,
    roleId,
    muser,
    usaccess,
    mkelas,
    mintquestion,
  } = req.body;

  const { id } = req.params;

  try {
    const userData = await user.findOne({
      where: {
        id,
      },
      include: ["access"],
    });

    if (!userData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Data user tidak ditemukan", timeExecution);
    }

    userData.fullname = fullname;
    userData.username = username;
    userData.email = email;
    userData.roleId = roleId;

    await userData.save();

    userData.access.muser = muser;
    userData.access.usaccess = usaccess;
    userData.access.mkelas = mkelas;
    userData.access.mintquestion = mintquestion;

    await userData.access.save();

    const timeExecution = Date.now() - startTime;
    return successResponse(res, "User berhasil diperbaharui", timeExecution);
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
          fieldName = "No. HP";
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

const updateStatusInternalUserController = async (req, res, startTime) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const { status } = req.body;

  const { id } = req.params;

  try {
    const userData = await user.findOne({
      where: {
        id,
      },
    });

    if (!userData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Data user tidak ditemukan", timeExecution);
    }

    userData.activeStatus = status;

    await userData.save();

    const timeExecution = Date.now() - startTime;
    return successResponse(
      res,
      "Status user berhasil diperbaharui",
      timeExecution
    );
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const deleteInternalUserByIdController = async (req, res, startTime) => {
  const { id } = req.params;

  try {
    const userData = await user.findOne({
      where: {
        id,
      },
    });

    if (!userData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Data user tidak ditemukan", timeExecution);
    }

    const userDelete = await user.destroy({
      where: {
        id,
      },
    });

    const timeExecution = Date.now() - startTime;
    return successResponse(res, "User berhasil dihapus", timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

module.exports = {
  getAllStudentUserController,
  getAllInternalUserController,
  getStudentUserByIdController,
  getInternalUserByIdController,
  updateInternalUserController,
  addInternalUserController,
  updateStatusInternalUserController,
  deleteInternalUserByIdController,
  getStudentUserFileByIdController,
  updateStatusUserByIdController,
};
