const express = require("express");
const { validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models/index.model");

const { errorValidationResponse } = require("./configs/response");

const verifyToken = require("./middlewares/authMiddleware");

const {
  validateRegister,
  validateLogin,
} = require("./validators/auth.validator");
const { validateUserDetail } = require("./validators/userDetail.validator");
const {
  validateUpdateStatusUser,
} = require("./validators/updateStatusUser.validator");

const { validateAdminLogin } = require("./validators/iso/auth.validator");
const {
  validatePostUserAccess,
  validatePutUserAccess,
  validateUpdateStatusUserAccess,
} = require("./validators/iso/userAccess.validator");

const {
  registerController,
  loginController,
  getLoginDataController,
} = require("./controllers/auth.controller");
const {
  getAllUserController,
  getUserByIdController,
  updateStatusUserByIdController,
  getAllStudentUserController,
  getAllInternalUserController,
  getStudentUserByIdController,
  getInternalUserByIdController,
  updateInternalUserController,
  addInternalUserController,
  updateStatusInternalUserController,
  deleteInternalUserByIdController,
  getStudentUserFileByIdController,
} = require("./controllers/user.controller");
const {
  addUserDetailController,
} = require("./controllers/userDetail.controller");

const { adminLoginController } = require("./controllers/iso/auth.controller");
const {
  getAllUserAccessController,
  getUserAccessByIdController,
  updateUserAccessByIdController,
  addUserAccessController,
  updateStatusUserAccessByIdController,
} = require("./controllers/iso/user.controller");
const { getAllRoleController } = require("./controllers/role.controller");
const {
  validateUpdateInternalUser,
  validateAddInternalUser,
  validateUpdateStatusInternalUser,
} = require("./validators/user.validator");

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

const allowedOrigins = ["http://127.0.0.1:3001", "http://localhost:3001"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const router = express.Router();

// register
router.post("/register", validateRegister, (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  registerController(req, res, startTime);
});

// login
router.post("/login", validateLogin, (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  loginController(req, res, startTime);
});

router.get("/login/data", verifyToken, getLoginDataController);

// admin user access
router.get("/admin/user-access", verifyToken, getAllUserAccessController);
router.get("/admin/user-access/:id", getUserAccessByIdController);
router.post("/admin/user-access", validatePostUserAccess, (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  addUserAccessController(req, res, startTime);
});
router.put("/admin/user-access/:id", validatePutUserAccess, (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  updateUserAccessByIdController(req, res, startTime);
});
router.put(
  "/admin/user-access/status/:id",
  validateUpdateStatusUserAccess,
  (req, res) => {
    const startTime = Date.now();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const timeExecution = Date.now() - startTime;

      return errorValidationResponse(res, errors, timeExecution);
    }

    updateStatusUserAccessByIdController(req, res, startTime);
  }
);

//user
router.get("/user/student", getAllStudentUserController);
router.get("/user/internal", getAllInternalUserController);
router.get("/user/student/detail/:id", getStudentUserByIdController);
router.get("/user/internal/detail/:id", getInternalUserByIdController);
router.get(
  "/user/student/download/:column/:id",
  getStudentUserFileByIdController
);
router.post("/user/internal", validateAddInternalUser, (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  addInternalUserController(req, res, startTime);
});
router.put(
  "/user/internal/edit/:id",
  validateUpdateInternalUser,
  (req, res) => {
    const startTime = Date.now();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const timeExecution = Date.now() - startTime;

      return errorValidationResponse(res, errors, timeExecution);
    }

    updateInternalUserController(req, res, startTime);
  }
);
router.put(
  "/user/internal/edit/status/:id",
  validateUpdateStatusInternalUser,
  (req, res) => {
    const startTime = Date.now();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const timeExecution = Date.now() - startTime;

      return errorValidationResponse(res, errors, timeExecution);
    }

    updateStatusInternalUserController(req, res, startTime);
  }
);
router.delete("/user/internal/delete/:id", deleteInternalUserByIdController);
router.post("/user/student/detail", validateUserDetail, (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  addUserDetailController(req, res, startTime);
});
router.put("/user/status/:id", validateUpdateStatusUser, (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  updateStatusUserByIdController(req, res, startTime);
});

router.get("/role", getAllRoleController);

app.use("/iso/api", router);

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database connected successfully!");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
