const fs = require("fs");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcrypt");
const { Sequelize } = require("sequelize");
const {
  user,
  userDetail,
  classModel,
  section,
  topic,
  subsection,
} = require("../models/index.model");
const {
  internalServerErrorResponse,
  successResponse,
  notfoundResponse,
  successCreatedResponse,
  badRequestResponse,
} = require("../configs/response");

const getSubsectionBySectionIdController = async (req, res) => {
  const startTime = Date.now();

  const { id } = req.params;

  try {
    const subsections = await subsection.findAll({
      where: {
        sectionId: id,
      },
    });

    const timeExecution = Date.now() - startTime;
    return successResponse(res, subsections, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getSubsectionByIdController = async (req, res) => {
  const startTime = Date.now();

  const { id } = req.params;

  try {
    const subsectionData = await subsection.findOne({
      where: {
        id,
      },
    });

    if (!subsectionData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Sub bab tidak ditemukan", timeExecution);
    }

    const subsectionPlain = subsectionData.toJSON();

    // Construct the video URL if the file exists
    const constructVideoUrl = (sectionId, fileName) => {
      if (!fileName) return null;

      const videoPath = path.join(
        __dirname,
        "../public/class/section",
        sectionId.toString(),
        fileName
      );
      if (fs.existsSync(videoPath)) {
        return `/video-pembelajaran/${sectionId}/${fileName}`; // Adjust based on your frontend setup
      }
      return null;
    };

    // Generate video URL instead of Base64 encoding
    subsectionPlain.videoUrl = constructVideoUrl(
      subsectionPlain.sectionId,
      subsectionPlain.video
    );

    const timeExecution = Date.now() - startTime;
    return successResponse(res, subsectionPlain, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getNextFilename = (folderPath, prefix, extname) => {
  const files = fs.readdirSync(folderPath);
  let maxNumber = 0;
  files.forEach((file) => {
    const match = file.match(new RegExp(`^${prefix}(\\d+)\\.`));
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNumber) maxNumber = num;
    }
  });
  return `${prefix}${maxNumber + 1}${extname}`;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const sectionId = req.body.sectionId;

    if (!sectionId) {
      return cb(new Error("sectionId is missing"), null);
    }

    const userFolderPath = path.join(
      __dirname,
      "../public/class/section",
      sectionId.toString()
    );

    if (!fs.existsSync(userFolderPath)) {
      fs.mkdirSync(userFolderPath, { recursive: true });
    }

    cb(null, userFolderPath);
  },
  filename: function (req, file, cb) {
    const sectionId = req.body.sectionId;
    if (!sectionId) {
      return cb(new Error("sectionId is missing"), null);
    }

    const userFolderPath = path.join(
      __dirname,
      "../public/class/section",
      sectionId.toString()
    );

    const uniqueFilename = getNextFilename(
      userFolderPath,
      "subsection",
      path.extname(file.originalname)
    );

    cb(null, uniqueFilename);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter }).fields([
  { name: "video", maxCount: 1 },
  { name: "sectionId" },
  { name: "value" },
  { name: "materi" },
]);

const addSubsectionController = async (req, res, startTime) => {
  upload(req, res, async function (err) {
    if (err) {
      const value = err.message;
      const timeExecution = Date.now() - startTime;
      return badRequestResponse(res, value, timeExecution);
    }

    const { sectionId, value, materi } = req.body;
    let videoFilename = req.files.video ? req.files.video[0].filename : null;

    try {
      const subsectionCreated = await subsection.create({
        sectionId,
        value,
        video: videoFilename,
        materi,
      });

      const timeExecution = Date.now() - startTime;
      return successCreatedResponse(res, subsectionCreated, timeExecution);
    } catch (error) {
      console.log(error);
      const timeExecution = Date.now() - startTime;
      return internalServerErrorResponse(res, timeExecution);
    }
  });
};

const updateSubsectionController = async (req, res, startTime) => {
  // const { sectionId, value, materi } = req.body;
  // const videoFile = req.files && req.files.video ? req.files.video[0] : null;
  // const subsectionId = req.params.id;

  upload(req, res, async function (err) {
    const { sectionId, value, materi } = req.body;
    const videoFile = req.files && req.files.video ? req.files.video[0] : null;
    const subsectionId = req.params.id;

    if (err) {
      const value = err.message;
      const timeExecution = Date.now() - startTime;
      return badRequestResponse(res, value, timeExecution);
    }

    try {
      const existingSubsection = await subsection.findOne({
        where: { id: subsectionId },
      });

      if (!existingSubsection) {
        const timeExecution = Date.now() - startTime;
        return notfoundResponse(res, "Sub bab tidak ditemukan", timeExecution);
      }

      if (videoFile) {
        console.log("hapus video");
        const oldVideoPath = path.join(
          __dirname,
          "../public/class/section",
          sectionId.toString(),
          existingSubsection.video
        );
        if (fs.existsSync(oldVideoPath)) {
          fs.unlinkSync(oldVideoPath);
        }
      }

      existingSubsection.value = value;
      existingSubsection.materi = materi;
      existingSubsection.video = videoFile
        ? videoFile.filename
        : existingSubsection.video;

      await existingSubsection.save();

      // const updatedSubsection = await existingSubsection.update({
      //   value,
      //   materi,
      //   video: videoFile ? videoFile.filename : existingSubsection.video,
      // });

      const timeExecution = Date.now() - startTime;
      return successResponse(res, existingSubsection, timeExecution);
    } catch (error) {
      console.log(error);
      const timeExecution = Date.now() - startTime;
      return internalServerErrorResponse(res, timeExecution);
    }
  });
};

// const updateSubsectionController = async (req, res, startTime) => {
//   Object.keys(req.body).forEach((key) => {
//     if (req.body[key] === "") {
//       req.body[key] = null;
//     }
//   });

//   const {
//     title,
//     subtitle,
//     thumbnail,
//     mentorId,
//     duration,
//     level,
//     month,
//     format,
//     type,
//     description,
//   } = req.body;

//   const { id } = req.params;

//   try {
//     const classData = await classModel.findOne({
//       where: {
//         id,
//       },
//     });

//     if (!classData) {
//       const timeExecution = Date.now() - startTime;
//       return notfoundResponse(res, "Data kelas tidak ditemukan", timeExecution);
//     }

//     classData.title = title;
//     classData.subtitle = subtitle;
//     classData.mentorId = mentorId;
//     classData.duration = duration;
//     classData.level = level;
//     classData.month = month;
//     classData.format = format;
//     classData.type = type;
//     classData.description = description;

//     if (thumbnail) {
//       const userFolderPath = path.join(__dirname, "../public/class/thumbnail");

//       if (classData.thumbnail) {
//         const oldFilePath = path.join(userFolderPath, classData.thumbnail);
//         if (fs.existsSync(oldFilePath)) {
//           fs.unlinkSync(oldFilePath);
//         }
//       }

//       let arrFilename = [];
//       const saveBase64ToFile = (base64String, fileName) => {
//         const matches = base64String.match(/^data:(.+);base64,/);
//         if (!matches || matches.length < 2) {
//           return badRequestResponse(res, "File invalid");
//         }
//         const extension = matches[1].split("/")[1];
//         const filePath = path.join(userFolderPath, `${fileName}.${extension}`);
//         arrFilename.push(`${fileName}.${extension}`);
//         const base64Data = base64String.split(";base64,").pop();
//         fs.writeFileSync(filePath, base64Data, { encoding: "base64" });
//       };

//       const uniqueFilename = getNextFilename(userFolderPath, "thumbnail");
//       saveBase64ToFile(thumbnail, uniqueFilename);

//       let thumbnailFilename = arrFilename[0];

//       classData.thumbnail = thumbnailFilename;
//     }

//     await classData.save();

//     const timeExecution = Date.now() - startTime;
//     return successResponse(res, "Kelas berhasil diperbaharui", timeExecution);
//   } catch (error) {
//     if (error instanceof Sequelize.UniqueConstraintError) {
//       let fieldName;
//       const field = error.errors[0].path;
//       switch (field) {
//         case "title":
//           fieldName = "Nama Kelas";
//           break;
//         default:
//           fieldName = field;
//           break;
//       }
//       const value = error.errors[0].value;
//       const timeExecution = Date.now() - startTime;
//       return badRequestResponse(
//         res,
//         `Data '${value}' pada '${fieldName}' sudah terdaftar.`,
//         timeExecution
//       );
//     }

//     console.log(error);
//     const timeExecution = Date.now() - startTime;
//     return internalServerErrorResponse(res, timeExecution);
//   }
// };

module.exports = {
  getSubsectionBySectionIdController,
  getSubsectionByIdController,
  addSubsectionController,
  updateSubsectionController,
};
