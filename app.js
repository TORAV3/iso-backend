const express = require("express");
const { validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models/index.model");

const { errorValidationResponse } = require("./configs/response");

const {
  validateRegister,
  validateLogin,
} = require("./validators/auth.validator");
const { validateMemberRegister } = require("./validators/member.validator");

const {
  registerController,
  loginController,
} = require("./controllers/auth.controller");
const {
  memberRegistrationController,
  getAllMemberController,
  getMemberByIdController,
} = require("./controllers/member.controller");
const {
  getAllUserController,
  getUserByIdController,
} = require("./controllers/user.controller");

const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

const allowedOrigins = ["http://127.0.0.1:5173", "http://localhost:5173"];

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

//user
router.get("/user", getAllUserController);
router.get("/user/:id", getUserByIdController);

//member
router.get("/member", getAllMemberController);
router.get("/member/:id", getMemberByIdController);

router.post("/member/register", validateMemberRegister, (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  memberRegistrationController(req, res, startTime);
});

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
