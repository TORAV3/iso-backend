const { Sequelize } = require("sequelize");
const { intquestion, test, classModel } = require("../models/index.model");
const {
  successCreatedResponse,
  badRequestResponse,
  internalServerErrorResponse,
  notfoundResponse,
  successResponse,
} = require("../configs/response");

const getAllTestController = async (req, res) => {
  const startTime = Date.now();
  try {
    const { status } = req.query;

    let tests;

    if (status === "all") {
      tests = await test.findAll({
        include: [
          {
            model: classModel,
          },
        ],
      });
    } else {
      tests = await test.findAll({
        where: {
          status,
        },
        include: [
          {
            model: classModel,
          },
        ],
      });
    }

    const timeExecution = Date.now() - startTime;
    return successResponse(res, tests, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getTestByIdController = async (req, res) => {
  const startTime = Date.now();

  const { id } = req.params;

  try {
    const testData = await test.findOne({
      where: {
        id,
      },
    });

    if (!testData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Tes tidak ditemukan", timeExecution);
    }

    const timeExecution = Date.now() - startTime;
    return successResponse(res, testData, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const addTestController = async (req, res, startTime) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const { title, desc, classId } = req.body;

  try {
    const testCreated = await test.create({
      title,
      desc,
      classId,
    });

    const timeExecution = Date.now() - startTime;
    return successCreatedResponse(res, testCreated, timeExecution);
  } catch (error) {
    // if (error instanceof Sequelize.UniqueConstraintError) {
    //   let fieldName;
    //   const field = error.errors[0].path;
    //   switch (field) {
    //     case "question":
    //       fieldName = "Pertanyaan";
    //       break;
    //     default:
    //       fieldName = field;
    //       break;
    //   }
    //   const value = error.errors[0].value;
    //   const timeExecution = Date.now() - startTime;
    //   return badRequestResponse(
    //     res,
    //     `Data '${value}' pada '${fieldName}' sudah terdaftar.`,
    //     timeExecution
    //   );
    // }

    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const updateTestController = async (req, res, startTime) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const { title, desc, classId } = req.body;

  const { id } = req.params;

  try {
    const testData = await test.findOne({
      where: {
        id,
      },
    });

    if (!testData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Data tes tidak ditemukan", timeExecution);
    }

    testData.classId = classId;
    testData.title = title;
    testData.desc = desc;

    await testData.save();

    const timeExecution = Date.now() - startTime;
    return successResponse(res, "Tes berhasil diperbaharui", timeExecution);
  } catch (error) {
    // if (error instanceof Sequelize.UniqueConstraintError) {
    //   let fieldName;
    //   const field = error.errors[0].path;
    //   switch (field) {
    //     case "question":
    //       fieldName = "Pertanyaan";
    //       break;
    //     default:
    //       fieldName = field;
    //       break;
    //   }
    //   const value = error.errors[0].value;
    //   const timeExecution = Date.now() - startTime;
    //   return badRequestResponse(
    //     res,
    //     `Data '${value}' pada '${fieldName}' sudah terdaftar.`,
    //     timeExecution
    //   );
    // }

    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const updateStatusTestController = async (req, res, startTime) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const { status } = req.body;

  const { id } = req.params;

  try {
    const testData = await test.findOne({
      where: {
        id,
      },
    });

    if (!testData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Data tes tidak ditemukan", timeExecution);
    }

    testData.status = status;

    await testData.save();

    const timeExecution = Date.now() - startTime;
    return successResponse(
      res,
      "Status tes berhasil diperbaharui",
      timeExecution
    );
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const deleteTestByIdController = async (req, res, startTime) => {
  const { id } = req.params;

  try {
    const testData = await test.findOne({
      where: {
        id,
      },
    });

    if (!testData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Data tes tidak ditemukan", timeExecution);
    }

    const testDelete = await test.destroy({
      where: {
        id,
      },
    });

    const timeExecution = Date.now() - startTime;
    return successResponse(res, "Tes berhasil dihapus", timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

module.exports = {
  getAllTestController,
  getTestByIdController,
  addTestController,
  updateTestController,
  updateStatusTestController,
  deleteTestByIdController,
};
