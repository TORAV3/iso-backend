const fs = require("fs");
const path = require("path");
const { user, userDetail } = require("../models/index.model");
const {
  internalServerErrorResponse,
  successResponse,
  notfoundResponse,
} = require("../configs/response");

const getAllUserController = async (req, res) => {
  const startTime = Date.now();
  try {
    const { status } = req.query;

    let users;

    if (
      status !== "reviewed" ||
      status !== "revisi" ||
      status !== "register" ||
      status !== "approve" ||
      status !== "reject"
    ) {
      users = await user.findAll({
        where: {
          status,
        },
      });
    } else {
      users = await user.findAll();
    }

    const timeExecution = Date.now() - startTime;
    return successResponse(res, users, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getUserByIdController = async (req, res) => {
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

module.exports = {
  getAllUserController,
  getUserByIdController,
  updateStatusUserByIdController,
};
