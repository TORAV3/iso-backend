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

const getSectionByClassIdController = async (req, res) => {
  const startTime = Date.now();

  const { id } = req.params;

  try {
    const sections = await section.findAll({
      where: {
        classId: id,
      },
    });

    const timeExecution = Date.now() - startTime;
    return successResponse(res, sections, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getSectionByIdController = async (req, res) => {
  const startTime = Date.now();

  const { id } = req.params;

  try {
    const sectionData = await section.findOne({
      where: {
        id,
      },
    });

    if (!sectionData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Bab tidak ditemukan", timeExecution);
    }

    const timeExecution = Date.now() - startTime;
    return successResponse(res, sectionData, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const addSectionController = async (req, res, startTime) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const { value, classId } = req.body;

  try {
    const sectionCreated = await section.create({
      value,
      classId,
    });

    const timeExecution = Date.now() - startTime;
    return successCreatedResponse(res, sectionCreated, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const updateSectionController = async (req, res, startTime) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const { value, classId } = req.body;

  const { id } = req.params;

  try {
    const sectionData = await section.findOne({
      where: {
        id,
      },
    });

    if (!sectionData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Data topik tidak ditemukan", timeExecution);
    }

    sectionData.value = value;
    sectionData.classId = classId;

    await sectionData.save();

    const timeExecution = Date.now() - startTime;
    return successResponse(res, "Bab berhasil diperbaharui", timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const deleteSectionByIdController = async (req, res, startTime) => {
  const { id } = req.params;

  try {
    const sectionData = await section.findOne({
      where: {
        id,
      },
    });

    if (!sectionData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Data bab tidak ditemukan", timeExecution);
    }

    const sectionDelete = await section.destroy({
      where: {
        id,
      },
    });

    const timeExecution = Date.now() - startTime;
    return successResponse(res, "Bab berhasil dihapus", timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

module.exports = {
  getSectionByClassIdController,
  getSectionByIdController,
  addSectionController,
  updateSectionController,
  deleteSectionByIdController,
};
