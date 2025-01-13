const { user } = require("../models/index.model");
const {
  internalServerErrorResponse,
  successResponse,
} = require("../configs/response");

const getAllUserController = async (req, res) => {
  const startTime = Date.now();
  try {
    const users = await user.findAll();
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

module.exports = {
  getAllUserController,
  getUserByIdController,
};
