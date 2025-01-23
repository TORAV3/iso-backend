const {
  successResponse,
  internalServerErrorResponse,
} = require("../configs/response");
const { role } = require("../models/index.model");

const getAllRoleController = async (req, res) => {
  const startTime = Date.now();
  try {
    const roles = await role.findAll();

    const timeExecution = Date.now() - startTime;
    return successResponse(res, roles, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

module.exports = {
  getAllRoleController,
};
