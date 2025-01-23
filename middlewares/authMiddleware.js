const jwt = require("jsonwebtoken");
const {
  notAuthorizeResponse,
  forbiddenResponse,
  unauthorizeResponse,
} = require("../configs/response");

const verifyToken = (req, res, next) => {
  const startTime = Date.now();

  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    const timeExecution = Date.now() - startTime;
    return forbiddenResponse(
      res,
      "Akses ditolak, tolong sertakan token",
      timeExecution
    );
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    const timeExecution = Date.now() - startTime;
    return forbiddenResponse(
      res,
      "Akses ditolak, tolong sertakan token",
      timeExecution
    );
  }

  jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
    if (err) {
      const timeExecution = Date.now() - startTime;
      return unauthorizeResponse(
        res,
        "Akses ditolak, token tidak valid atau expired",
        timeExecution
      );
    }

    req.userLoginData = decoded;
    next();
  });
};

module.exports = verifyToken;
