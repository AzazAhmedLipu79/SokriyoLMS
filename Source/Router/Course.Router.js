const express = require("express");
const {
  getAllCourse,
  CreateACourse,
  UpdateACourse,
  getCourseBySlug,
} = require("../Controller/Course.Controller.js");
const { authenticateToken } = require("../../Middleware/verifyToken.js");

//-------------------------------------------------------------------------------------
// Create a router object using the express.Router() method
const CourseRouter = express.Router();
CourseRouter.use("/CREATE ", authenticateToken);
CourseRouter.use("/UPDATE/:slug ", authenticateToken);

//-------------------------------------------------------------------------------------
//AUTH/REGISTRATION
// Define a route handler for creating a new blog using a POST request to /POST
CourseRouter.route("/").get(getAllCourse);
CourseRouter.route("/CREATE").post(CreateACourse);
CourseRouter.route("/:slug").get(getCourseBySlug);
CourseRouter.route("/UPDATE/:slug").put(UpdateACourse);
// CourseRouter.route("/DELETE").post(CreateACourse);

//-------------------------------------------------------------------------------------
module.exports = CourseRouter;
