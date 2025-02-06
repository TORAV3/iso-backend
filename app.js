const express = require("express");
const { validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const path = require("path");
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
const {
  getAllClassController,
  getClassByIdController,
  addClassController,
  updateClassController,
  deleteClassByIdController,
  updateStatusClassController,
} = require("./controllers/class.controller");
const {
  validateCreateClass,
  validateUpdateClass,
  validateUpdateStatusClass,
} = require("./validators/class.validator");
const {
  getTopicByClassIdController,
  getTopicByIdController,
  addTopicController,
  updateTopicController,
  deleteTopicByIdController,
} = require("./controllers/topic.controller");
const { validateTopic } = require("./validators/topic.validator");
const {
  getSectionByClassIdController,
  getSectionByIdController,
  addSectionController,
  updateSectionController,
  deleteSectionByIdController,
} = require("./controllers/section.controller");
const { validateSection } = require("./validators/section.validator");
const {
  getSubsectionBySectionIdController,
  getSubsectionByIdController,
  addSubsectionController,
  updateSubsectionController,
} = require("./controllers/subsection.controller");
const { validateSubsection } = require("./validators/subsection.validator");
const {
  getAllInterviewQuestionController,
  getInterviewQuestionByIdController,
  addInterviewQuestionController,
  updateInterviewQuestionController,
  deleteInterviewQuestionByIdController,
  updateStatusInterviewQuestionController,
} = require("./controllers/intquestion.controller");
const {
  validateAddInterviewQuestion,
  validateUpdateInterviewQuestion,
  validateUpdateStatusInterviewQuestion,
} = require("./validators/intquestion.validator");
const {
  getAllTestController,
  getTestByIdController,
  addTestController,
  updateTestController,
  updateStatusTestController,
  deleteTestByIdController,
} = require("./controllers/test.controller");
const {
  validateUpdateTest,
  validateUpdateStatusTest,
  validateAddTest,
} = require("./validators/test.validator");
const {
  getSoalByTestIdController,
  addSoalController,
} = require("./controllers/soal.controller");

const app = express();
app.use(
  "/video-pembelajaran",
  express.static(path.join(__dirname, "public/class/section"))
);
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

router.get("/class", getAllClassController);
router.get("/class/detail/:id", getClassByIdController);
router.post("/class", validateCreateClass, (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  addClassController(req, res, startTime);
});
router.put("/class/:id", validateUpdateClass, (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  updateClassController(req, res, startTime);
});
router.put("/class/edit/status/:id", validateUpdateStatusClass, (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  updateStatusClassController(req, res, startTime);
});
router.delete("/class/:id", deleteClassByIdController);

router.get("/topic/classId/:id", getTopicByClassIdController);
router.get("/topic/:id", getTopicByIdController);
router.post("/topic", validateTopic, (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  addTopicController(req, res, startTime);
});
router.put("/topic/:id", validateTopic, (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  updateTopicController(req, res, startTime);
});
router.delete("/topic/:id", deleteTopicByIdController);

router.get("/section/classId/:id", getSectionByClassIdController);
router.get("/section/:id", getSectionByIdController);
router.post("/section", validateSection, (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  addSectionController(req, res, startTime);
});
router.put("/section/:id", validateSection, (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  updateSectionController(req, res, startTime);
});
router.delete("/section/:id", deleteSectionByIdController);

router.get("/subsection/sectionId/:id", getSubsectionBySectionIdController);
router.get("/subsection/:id", getSubsectionByIdController);
router.post("/subsection", (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  addSubsectionController(req, res, startTime);
});
router.put("/subsection/:id", (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  updateSubsectionController(req, res, startTime);
});

router.get("/interview/question", getAllInterviewQuestionController);
router.get(
  "/interview/question/detail/:id",
  getInterviewQuestionByIdController
);
router.post("/interview/question", validateAddInterviewQuestion, (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  addInterviewQuestionController(req, res, startTime);
});
router.put(
  "/interview/question/edit/:id",
  validateUpdateInterviewQuestion,
  (req, res) => {
    const startTime = Date.now();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const timeExecution = Date.now() - startTime;

      return errorValidationResponse(res, errors, timeExecution);
    }

    updateInterviewQuestionController(req, res, startTime);
  }
);
router.put(
  "/interview/question/edit/status/:id",
  validateUpdateStatusInterviewQuestion,
  (req, res) => {
    const startTime = Date.now();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const timeExecution = Date.now() - startTime;

      return errorValidationResponse(res, errors, timeExecution);
    }

    updateStatusInterviewQuestionController(req, res, startTime);
  }
);
router.delete(
  "/interview/question/delete/:id",
  deleteInterviewQuestionByIdController
);

router.get("/test", getAllTestController);
router.get("/test/detail/:id", getTestByIdController);
router.post("/test", validateAddTest, (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  addTestController(req, res, startTime);
});
router.put("/test/edit/:id", validateUpdateTest, (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  updateTestController(req, res, startTime);
});
router.put("/test/edit/status/:id", validateUpdateStatusTest, (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  updateStatusTestController(req, res, startTime);
});
router.delete("/test/delete/:id", deleteTestByIdController);

router.get("/soal/testId/:id", getSoalByTestIdController);
router.post("/soal", (req, res) => {
  const startTime = Date.now();

  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   const timeExecution = Date.now() - startTime;

  //   return errorValidationResponse(res, errors, timeExecution);
  // }

  addSoalController(req, res, startTime);
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
