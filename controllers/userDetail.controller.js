const { Sequelize, Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const { user, userDetail } = require("../models/index.model");
const {
  badRequestResponse,
  internalServerErrorResponse,
  successCreatedResponse,
} = require("../configs/response");

// const generateMemberId = async (req, res) => {
//   const today = moment().format("DDMMYY");

//   const latestMember = await member.findOne({
//     where: {
//       id: {
//         [Op.like]: `ISO${today}%`,
//       },
//     },
//     order: [["id", "DESC"]],
//   });

//   let counter = 1;

//   if (latestMember) {
//     const lastId = latestMember.id;
//     const lastCounter = parseInt(lastId.slice(-3), 10);
//     counter = lastCounter + 1;
//   }

//   const newId = `ISO${today}${String(counter).padStart(3, "0")}`;

//   return newId;
// };

const addUserDetailController = async (req, res, startTime) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const {
    trainbef,
    nik,
    gender,
    religion,
    birthplace,
    birthdate,
    height,
    weight,
    city,
    address,
    lastedu,
    program,
    dadName,
    dadPhone,
    dadAddress,
    momName,
    momPhone,
    momAddress,
    kinsmanName,
    kinsmanPhone,
    kinsmanAddress,
    pasFoto,
    fullBodyFoto,
    ktp,
    kk,
    akta,
    ijazah,
    sks,
    vaksin,
    sertifikat,
    userId,
  } = req.body;

  // const newId = await generateMemberId();

  try {
    const userFolderPath = path.join(
      __dirname,
      "../public/upload",
      userId.toString()
    );
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

    if (pasFoto) saveBase64ToFile(pasFoto, "pasFoto_" + userId.toString());
    if (fullBodyFoto)
      saveBase64ToFile(fullBodyFoto, "fullBodyFoto_" + userId.toString());
    if (ktp) saveBase64ToFile(ktp, "ktp_" + userId.toString());
    if (kk) saveBase64ToFile(kk, "kk_" + userId.toString());
    if (akta) saveBase64ToFile(akta, "akta_" + userId.toString());
    if (ijazah) saveBase64ToFile(ijazah, "ijazah_" + userId.toString());
    if (sks) saveBase64ToFile(sks, "sks_" + userId.toString());
    if (vaksin) saveBase64ToFile(vaksin, "vaksin_" + userId.toString());
    if (sertifikat)
      saveBase64ToFile(sertifikat, "sertifikat_" + userId.toString());

    let pasFotoFilename = arrFilename[0];
    let fullBodyFotoFilename = arrFilename[1];
    let ktpFilename = arrFilename[2];
    let kkFilename = arrFilename[3];
    let aktaFilename = arrFilename[4];
    let ijazahFilename = arrFilename[5];
    let sksFilename = arrFilename[6];
    let vaksinFilename = null;
    if (vaksin) {
      vaksinFilename = arrFilename[7];
    }
    let sertifikatFilename = null;
    if (sertifikat) {
      sertifikatFilename = arrFilename[8];
    }

    const userDetailCreated = await userDetail.create({
      trainbef,
      nik,
      gender,
      religion,
      birthplace,
      birthdate,
      height,
      weight,
      city,
      address,
      lastedu,
      program,
      dadName,
      dadPhone,
      dadAddress,
      momName,
      momPhone,
      momAddress,
      kinsmanName,
      kinsmanPhone,
      kinsmanAddress,
      userId,
      pasFoto: pasFotoFilename,
      fullBodyFoto: fullBodyFotoFilename,
      ktp: ktpFilename,
      kk: kkFilename,
      akta: aktaFilename,
      ijazah: ijazahFilename,
      sks: sksFilename,
      vaksin: vaksinFilename,
      sertifikat: sertifikatFilename,
    });

    const timeExecution = Date.now() - startTime;
    return successCreatedResponse(
      res,
      "Data detail berhasil disimpan",
      timeExecution
    );
  } catch (error) {
    try {
      const userFolderPath = path.join(
        __dirname,
        "../public/upload",
        userId.toString()
      );
      if (fs.existsSync(userFolderPath)) {
        fs.rmSync(userFolderPath, { recursive: true, force: true });
      }
    } catch (folderDeletionError) {
      console.error("Failed to delete folder:", folderDeletionError);
    }

    if (error instanceof Sequelize.UniqueConstraintError) {
      let fieldName;
      const field = error.errors[0].path;
      switch (field) {
        case "nik":
          fieldName = "NIK";
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

    if (error instanceof Sequelize.ForeignKeyConstraintError) {
      const [field] = error.fields;
      const value = error.value;

      let fieldName;
      switch (field) {
        case "userId":
          fieldName = "ID User";
          break;
        default:
          fieldName = field;
          break;
      }
      const timeExecution = Date.now() - startTime;
      return badRequestResponse(
        res,
        `Data '${value}' pada '${fieldName}' belum terdaftar.`,
        timeExecution
      );
    }

    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

module.exports = {
  addUserDetailController,
};
