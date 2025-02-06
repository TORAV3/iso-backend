const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const { Sequelize } = require("sequelize");
const {
  user,
  userDetail,
  classModel,
  section,
  topic,
  subsection,
  test,
} = require("../models/index.model");
const {
  internalServerErrorResponse,
  successResponse,
  notfoundResponse,
  successCreatedResponse,
  badRequestResponse,
} = require("../configs/response");

const getAllClassController = async (req, res) => {
  const startTime = Date.now();
  try {
    const { type, status, topicParam } = req.query;

    let whereClause = {};
    if (type !== "all") {
      whereClause.type = type;
    }

    if (status !== "all") {
      whereClause.status = status;
    }

    const includeClause = [
      {
        model: topic,
        where: topicParam !== "all" ? { value: topicParam } : undefined,
        required: !!topicParam,
      },
    ];

    const classes = await classModel.findAll({
      where: whereClause,
      include: includeClause,
    });

    const classesPlain = classes.map((classInstance) => classInstance.toJSON());

    const encodeFileToBase64 = (fileName) => {
      if (!fileName) return null;
      const userFolderPath = path.join(__dirname, "../public/class/thumbnail");
      const filePath = path.join(userFolderPath, fileName);

      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        return `data:image/${path
          .extname(fileName)
          .slice(1)};base64,${fileBuffer.toString("base64")}`;
      }
      return null;
    };

    classesPlain.forEach((i) => {
      i.thumbnailBase64 = encodeFileToBase64(i.thumbnail);
    });

    const timeExecution = Date.now() - startTime;
    return successResponse(res, classesPlain, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getClassByIdController = async (req, res) => {
  const startTime = Date.now();

  const { id } = req.params;

  try {
    const classData = await classModel.findOne({
      where: {
        id,
      },
      include: [
        {
          model: test,
        },
        {
          model: topic,
        },
        {
          model: section,
          include: [
            {
              model: subsection,
            },
          ],
        },
      ],
    });

    if (!classData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Kelas tidak ditemukan", timeExecution);
    }

    const classPlain = classData.toJSON();

    const encodeFileToBase64 = (fileName) => {
      if (!fileName) return null;
      const userFolderPath = path.join(__dirname, "../public/class/thumbnail");
      const filePath = path.join(userFolderPath, fileName);

      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        return `data:image/${path
          .extname(fileName)
          .slice(1)};base64,${fileBuffer.toString("base64")}`;
      }
      return null;
    };

    classPlain.thumbnailBase64 = encodeFileToBase64(classPlain.thumbnail);

    const timeExecution = Date.now() - startTime;
    return successResponse(res, classPlain, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getNextFilename = (folderPath, prefix) => {
  const files = fs.readdirSync(folderPath);
  let maxNumber = 0;
  files.forEach((file) => {
    const match = file.match(new RegExp(`^${prefix}(\\d+)\\.`));
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNumber) maxNumber = num;
    }
  });
  return `${prefix}${maxNumber + 1}`;
};

const addClassController = async (req, res, startTime) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const {
    title,
    subtitle,
    thumbnail,
    mentorId,
    duration,
    level,
    month,
    format,
    type,
    description,
  } = req.body;

  try {
    const userFolderPath = path.join(__dirname, "../public/class/thumbnail");
    if (!fs.existsSync(userFolderPath)) {
      fs.mkdirSync(userFolderPath, { recursive: true });
    }

    let arrFilename = [];
    const saveBase64ToFile = (base64String, fileName) => {
      const matches = base64String.match(/^data:(.+);base64,/);
      if (!matches || matches.length < 2) {
        return badRequestResponse(res, "File invalid");
      }
      const extension = matches[1].split("/")[1];
      const filePath = path.join(userFolderPath, `${fileName}.${extension}`);
      arrFilename.push(`${fileName}.${extension}`);
      const base64Data = base64String.split(";base64,").pop();
      fs.writeFileSync(filePath, base64Data, { encoding: "base64" });
    };

    const uniqueFilename = getNextFilename(userFolderPath, "thumbnail");
    if (thumbnail) saveBase64ToFile(thumbnail, uniqueFilename);

    let thumbnailFilename = arrFilename[0];

    const classCreated = await classModel.create({
      title,
      subtitle,
      thumbnail: thumbnailFilename,
      mentorId,
      duration,
      level,
      month,
      format,
      type,
      description,
    });

    const timeExecution = Date.now() - startTime;
    return successCreatedResponse(res, classCreated, timeExecution);
  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
      let fieldName;
      const field = error.errors[0].path;
      switch (field) {
        case "title":
          fieldName = "Nama Kelas";
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

const updateClassController = async (req, res, startTime) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const {
    title,
    subtitle,
    thumbnail,
    mentorId,
    duration,
    level,
    month,
    format,
    type,
    description,
  } = req.body;

  const { id } = req.params;

  try {
    const classData = await classModel.findOne({
      where: {
        id,
      },
    });

    if (!classData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Data kelas tidak ditemukan", timeExecution);
    }

    classData.title = title;
    classData.subtitle = subtitle;
    classData.mentorId = mentorId;
    classData.duration = duration;
    classData.level = level;
    classData.month = month;
    classData.format = format;
    classData.type = type;
    classData.description = description;

    if (thumbnail) {
      const userFolderPath = path.join(__dirname, "../public/class/thumbnail");

      if (classData.thumbnail) {
        const oldFilePath = path.join(userFolderPath, classData.thumbnail);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      let arrFilename = [];
      const saveBase64ToFile = (base64String, fileName) => {
        const matches = base64String.match(/^data:(.+);base64,/);
        if (!matches || matches.length < 2) {
          return badRequestResponse(res, "File invalid");
        }
        const extension = matches[1].split("/")[1];
        const filePath = path.join(userFolderPath, `${fileName}.${extension}`);
        arrFilename.push(`${fileName}.${extension}`);
        const base64Data = base64String.split(";base64,").pop();
        fs.writeFileSync(filePath, base64Data, { encoding: "base64" });
      };

      const uniqueFilename = getNextFilename(userFolderPath, "thumbnail");
      saveBase64ToFile(thumbnail, uniqueFilename);

      let thumbnailFilename = arrFilename[0];

      classData.thumbnail = thumbnailFilename;
    }

    await classData.save();

    const timeExecution = Date.now() - startTime;
    return successResponse(res, "Kelas berhasil diperbaharui", timeExecution);
  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
      let fieldName;
      const field = error.errors[0].path;
      switch (field) {
        case "title":
          fieldName = "Nama Kelas";
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

const deleteClassByIdController = async (req, res, startTime) => {
  const { id } = req.params;

  try {
    const classData = await classModel.findOne({
      where: {
        id,
      },
    });

    if (!classData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Data kelas tidak ditemukan", timeExecution);
    }

    const classDelete = await classModel.destroy({
      where: {
        id,
      },
    });

    const timeExecution = Date.now() - startTime;
    return successResponse(res, "Kelas berhasil dihapus", timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const updateStatusClassController = async (req, res, startTime) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const { status } = req.body;

  const { id } = req.params;

  try {
    const classData = await classModel.findOne({
      where: {
        id,
      },
    });

    if (!classData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Data kelas tidak ditemukan", timeExecution);
    }

    classData.status = status;

    await classData.save();

    const timeExecution = Date.now() - startTime;
    return successResponse(
      res,
      "Status kelas berhasil diperbaharui",
      timeExecution
    );
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

module.exports = {
  getAllClassController,
  getClassByIdController,
  addClassController,
  updateClassController,
  deleteClassByIdController,
  updateStatusClassController,
};
