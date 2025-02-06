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
} = require("../models/index.model");
const {
  internalServerErrorResponse,
  successResponse,
  notfoundResponse,
  successCreatedResponse,
  badRequestResponse,
} = require("../configs/response");

const getTopicByClassIdController = async (req, res) => {
  const startTime = Date.now();

  const { id } = req.params;

  try {
    const topics = await topic.findAll({
      where: {
        classId: id,
      },
    });

    const timeExecution = Date.now() - startTime;
    return successResponse(res, topics, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getTopicByIdController = async (req, res) => {
  const startTime = Date.now();

  const { id } = req.params;

  try {
    const topicData = await topic.findOne({
      where: {
        id,
      },
    });

    if (!topicData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Topik tidak ditemukan", timeExecution);
    }

    const timeExecution = Date.now() - startTime;
    return successResponse(res, topicData, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const addTopicController = async (req, res, startTime) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const { value, classId } = req.body;

  try {
    const topicCreated = await topic.create({
      value,
      classId,
    });

    const timeExecution = Date.now() - startTime;
    return successCreatedResponse(res, topicCreated, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const updateTopicController = async (req, res, startTime) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const { value, classId } = req.body;

  const { id } = req.params;

  try {
    const topicData = await topic.findOne({
      where: {
        id,
      },
    });

    if (!topicData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Data topik tidak ditemukan", timeExecution);
    }

    topicData.value = value;
    topicData.classId = classId;

    await topicData.save();

    const timeExecution = Date.now() - startTime;
    return successResponse(res, "Topik berhasil diperbaharui", timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const deleteTopicByIdController = async (req, res, startTime) => {
  const { id } = req.params;

  try {
    const topicData = await topic.findOne({
      where: {
        id,
      },
    });

    if (!topicData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Data topik tidak ditemukan", timeExecution);
    }

    const topicDelete = await topic.destroy({
      where: {
        id,
      },
    });

    const timeExecution = Date.now() - startTime;
    return successResponse(res, "Topik berhasil dihapus", timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

module.exports = {
  getTopicByClassIdController,
  getTopicByIdController,
  addTopicController,
  updateTopicController,
  deleteTopicByIdController,
};
