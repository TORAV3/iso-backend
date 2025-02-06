const { Sequelize } = require("sequelize");
const { intquestion } = require("../models/index.model");
const {
  successCreatedResponse,
  badRequestResponse,
  internalServerErrorResponse,
  notfoundResponse,
  successResponse,
} = require("../configs/response");

const getAllInterviewQuestionController = async (req, res) => {
  const startTime = Date.now();
  try {
    const { status } = req.query;

    let questions;

    if (status === "all") {
      questions = await intquestion.findAll();
    } else {
      questions = await intquestion.findAll({
        where: {
          status,
        },
      });
    }

    const timeExecution = Date.now() - startTime;
    return successResponse(res, questions, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getInterviewQuestionByIdController = async (req, res) => {
  const startTime = Date.now();

  const { id } = req.params;

  try {
    const questionData = await intquestion.findOne({
      where: {
        id,
      },
    });

    if (!questionData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Pertanyaan tidak ditemukan", timeExecution);
    }

    const timeExecution = Date.now() - startTime;
    return successResponse(res, questionData, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const addInterviewQuestionController = async (req, res, startTime) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const { question } = req.body;

  try {
    const questionCreated = await intquestion.create({
      question,
    });

    const timeExecution = Date.now() - startTime;
    return successCreatedResponse(
      res,
      "Pertanyaan wawancara berhasil didaftarkan",
      timeExecution
    );
  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
      let fieldName;
      const field = error.errors[0].path;
      switch (field) {
        case "question":
          fieldName = "Pertanyaan";
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

const updateInterviewQuestionController = async (req, res, startTime) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const { question } = req.body;

  const { id } = req.params;

  try {
    const questionData = await intquestion.findOne({
      where: {
        id,
      },
    });

    if (!questionData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(
        res,
        "Data pertanyaan tidak ditemukan",
        timeExecution
      );
    }

    questionData.question = question;

    await questionData.save();

    const timeExecution = Date.now() - startTime;
    return successResponse(
      res,
      "Pertanyaan wawancara berhasil diperbaharui",
      timeExecution
    );
  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
      let fieldName;
      const field = error.errors[0].path;
      switch (field) {
        case "question":
          fieldName = "Pertanyaan";
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

const updateStatusInterviewQuestionController = async (req, res, startTime) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const { status } = req.body;

  const { id } = req.params;

  try {
    const questionData = await intquestion.findOne({
      where: {
        id,
      },
    });

    if (!questionData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(
        res,
        "Data pertanyaan tidak ditemukan",
        timeExecution
      );
    }

    questionData.status = status;

    await questionData.save();

    const timeExecution = Date.now() - startTime;
    return successResponse(
      res,
      "Status pertanyaan wawancara berhasil diperbaharui",
      timeExecution
    );
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const deleteInterviewQuestionByIdController = async (req, res, startTime) => {
  const { id } = req.params;

  try {
    const questionData = await intquestion.findOne({
      where: {
        id,
      },
    });

    if (!questionData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(
        res,
        "Data pertanyaan tidak ditemukan",
        timeExecution
      );
    }

    const questionDelete = await intquestion.destroy({
      where: {
        id,
      },
    });

    const timeExecution = Date.now() - startTime;
    return successResponse(
      res,
      "Pertanyaan wawancara berhasil dihapus",
      timeExecution
    );
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

module.exports = {
  getAllInterviewQuestionController,
  getInterviewQuestionByIdController,
  addInterviewQuestionController,
  updateInterviewQuestionController,
  updateStatusInterviewQuestionController,
  deleteInterviewQuestionByIdController,
};
