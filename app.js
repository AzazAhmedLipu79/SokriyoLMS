const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const limiter = require("./Config/limitReq.js");
require("dotenv").config();
const userRouter = require("./Source/Router/User.Router.js");
const cookieParser = require("cookie-parser");
const CourseRouter = require("./Source/Router/Course.Router.js");
const LessonRouter = require("./Source/Router/Lesson.Router.js");
const EnrollRouter = require("./Source/Router/Enroll.Router.js");

//-------------------------------------------------------------------------------------

const app = express();
const PORT = process.env.PORT || 1010;

//-------------------------------------------------------------------------------------
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors());
app.use(morgan("dev"));
app.use(limiter);
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  console.log("A request for things received at " + Date.now());
  next();
});

//-------------------------------------------------------------------------------------

// Define a route handler for the root path that sends a welcome message
app.get("/", (req, res) => {
  res.json({ message: "Welcome TO SOKRIYO LMS" });
});
// Use the user router for requests starting with /AUTH
app.use("/AUTH", userRouter);
app.use("/COURSE", CourseRouter);
app.use("/LESSON", LessonRouter);
app.use("/ENROLL", EnrollRouter);

//-------------------------------------------------------------------------------------
// Error handling middleware
app.use((err, req, res, next) => {
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      success: false,
      msg: "DUPLICATE ENTRY: You can't do twice registration or enroll with same email or user id",
    });
  } else if (err.code === "ER_DATA_TOO_LONG") {
    return res.status(409).json({
      success: false,
      msg: "DATA IS TOO LONG",
    });
  } else if (err.code === "ER_TRUNCATED_WRONG_VALUE") {
    return res.status(409).json({
      success: false,
      msg: "WRONG DATA TYPE INSERTED",
    });
  }
  console.error(err.stack); // Log the error
  // Check if err.status exists and use a default value of 500 if not
  const status = err.status || 500;
  res.status(status);
  // Send a custom error message based on the error type
  switch (err.name) {
    case "ValidationError":
      res.send("Invalid input data");
      break;
    case "AuthenticationError":
      res.send("Invalid credentials");
      break;
    case "AuthorizationError":
      res.send("Access denied");
      break;
    default:
      res.json({ err: "Something broke!" });
  }
});

//-------------------------------------------------------------------------------------
// Start the app on the specified port and log a message
app.listen(PORT, () => {
  console.log(
    `------------------------------------\n Server is running @ ${PORT} on ${process.env.NODE_ENV} Mode\n Maximum ${process.env.Rate_Limit} requests could be sent per 10 minute\n Mysql is running on ${process.env.MYSQL_HOST}\n------------------------------------`
  );
});
