function errorValidationResponse(res, errors, timeExecution) {
  return res.status(422).json({
    version: process.env.VERSION,
    status: 422,
    data: errors.array(),
    time_execution: `${timeExecution}ms`,
  });
}

function badRequestResponse(res, message, timeExecution) {
  return res.status(400).json({
    version: process.env.VERSION,
    status: 400,
    data: message,
    time_execution: `${timeExecution}ms`,
  });
}

function notfoundResponse(res, message, timeExecution) {
  return res.status(404).json({
    version: process.env.VERSION,
    status: 404,
    data: message,
    time_execution: `${timeExecution}ms`,
  });
}

function forbiddenResponse(res, message, timeExecution) {
  return res.status(403).json({
    version: process.env.VERSION,
    status: 403,
    data: message,
    time_execution: `${timeExecution}ms`,
  });
}

function unauthorizeResponse(res, message, timeExecution) {
  return res.status(401).json({
    version: process.env.VERSION,
    status: 401,
    data: message,
    time_execution: `${timeExecution}ms`,
  });
}

function internalServerErrorResponse(res, timeExecution) {
  return res.status(500).json({
    version: process.env.VERSION,
    status: 500,
    data: "Internal Server Error",
    time_execution: `${timeExecution}ms`,
  });
}

function successCreatedResponse(res, message, timeExecution) {
  return res.status(201).json({
    version: process.env.VERSION,
    status: 201,
    data: message,
    time_execution: `${timeExecution}ms`,
  });
}

function successResponse(res, data, timeExecution) {
  return res.status(200).json({
    version: process.env.VERSION,
    status: 200,
    data: data,
    time_execution: `${timeExecution}ms`,
  });
}

module.exports = {
  errorValidationResponse,
  badRequestResponse,
  successCreatedResponse,
  internalServerErrorResponse,
  notfoundResponse,
  forbiddenResponse,
  unauthorizeResponse,
  successResponse,
};
