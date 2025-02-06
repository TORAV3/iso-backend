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
  soal,
  jawaban,
  jawabanBenar,
  test,
} = require("../models/index.model");
const {
  internalServerErrorResponse,
  successResponse,
  notfoundResponse,
  successCreatedResponse,
  badRequestResponse,
} = require("../configs/response");

const getSoalByTestIdController = async (req, res) => {
  const startTime = Date.now();

  const { id } = req.params;

  try {
    const soals = await soal.findAll({
      where: {
        testId: id,
      },
      include: [
        {
          model: jawaban,
        },
        {
          model: jawabanBenar,
        },
      ],
    });

    const timeExecution = Date.now() - startTime;
    return successResponse(res, soals, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const addSoalController = async (req, res, startTime) => {
  const soalBody = req.body;

  try {
    // Find existing 'soal' records
    const soals = await soal.findAll({
      where: {
        testId: soalBody[0].testId,
      },
    });

    // Hard delete if records exist
    if (soals.length > 0) {
      await soal.destroy({
        where: {
          testId: soalBody[0].testId,
        },
        force: true,
      });
    }

    // Insert new 'soal' records properly
    for (const i of soalBody) {
      const soalCreated = await soal.create({
        value: i.soal,
        testId: i.testId,
      });

      // Insert options (jawaban)
      await Promise.all(
        i.opsi.map(async (o) => {
          await jawaban.create({
            opsi: o.opsi,
            value: o.value,
            soalId: soalCreated.id,
          });
        })
      );

      // Insert correct answer (jawabanBenar)
      await jawabanBenar.create({
        value: i.jawaban,
        soalId: soalCreated.id,
      });
    }

    const timeExecution = Date.now() - startTime;
    return successCreatedResponse(
      res,
      "Semua soal berhasil didaftarkan",
      timeExecution
    );
  } catch (error) {
    console.error(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

module.exports = {
  getSoalByTestIdController,
  addSoalController,
};
