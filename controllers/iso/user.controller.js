const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const {
  successResponse,
  internalServerErrorResponse,
  notfoundResponse,
  successCreatedResponse,
} = require("../../configs/response");
const { isoUser, isoAccess } = require("../../models/index.model");

const getAllUserAccessController = async (req, res) => {
  const startTime = Date.now();
  try {
    const { status } = req.query;

    let users;

    if (status === "all") {
      users = await isoUser.findAll({
        include: ["isoRole"],
      });
    } else {
      users = await isoUser.findAll({
        where: {
          status,
        },
        include: ["isoRole"],
      });
    }

    const timeExecution = Date.now() - startTime;

    return successResponse(res, users, timeExecution);
  } catch (error) {
    console.error(error);

    const timeExecution = Date.now() - startTime;

    return internalServerErrorResponse(res, timeExecution);
  }
};

const getUserAccessByIdController = async (req, res) => {
  const startTime = Date.now();

  const { id } = req.params;

  try {
    const userData = await isoUser.findOne({
      where: {
        id,
      },
      include: ["isoRole", "isoAccess"],
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

const addUserAccessController = async (req, res, startTime) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const { fullname, username, email, password, roleId, access } = req.body;
  const { muser } = access;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userCreated = await isoUser.create(
      {
        fullname,
        username,
        email,
        password: hashedPassword,
        roleId,
        isoAccess: {
          muser,
        },
      },
      { include: ["isoAccess"] }
    );

    const timeExecution = Date.now() - startTime;
    return successCreatedResponse(
      res,
      "User berhasil didaftarkan",
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
        case "username":
          fieldName = "Username";
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

const updateUserAccessByIdController = async (req, res, startTime) => {
  const { id } = req.params;

  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const { fullname, username, email, roleId, access } = req.body;
  const { muser } = access;

  try {
    const userData = await isoUser.findOne({
      where: {
        id,
      },
      include: ["isoAccess"],
    });

    if (!userData) {
      return res.status(404).json({
        success: false,
        code: 404,
        message: "User tidak ditemukan",
      });
    }

    userData.fullname = fullname;
    userData.username = username;
    userData.email = email;
    userData.roleId = roleId;

    await userData.save();

    if (userData.isoAccess) {
      userData.isoAccess.muser = muser;

      await userData.isoAccess.save();
    }

    const timeExecution = Date.now() - startTime;
    return successResponse(
      res,
      "Data user berhasil diperbaharui",
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
        case "username":
          fieldName = "Username";
          break;
        case "email":
          fieldName = "Email";
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

const updateStatusUserAccessByIdController = async (req, res, startTime) => {
  const { id } = req.params;

  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const { status } = req.body;

  try {
    const userData = await isoUser.findOne({
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

module.exports = {
  getAllUserAccessController,
  getUserAccessByIdController,
  addUserAccessController,
  updateUserAccessByIdController,
  updateStatusUserAccessByIdController,
};
