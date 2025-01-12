function errorValidationResponse(res, errors, timeExecution) {
  return res.status(402).json({
    version: process.env.VERSION,
    status: 402,
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

module.exports = {
  errorValidationResponse,
  badRequestResponse,
  successCreatedResponse,
  internalServerErrorResponse,
};
