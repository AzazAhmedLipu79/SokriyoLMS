const express = require("express");
const {
  getAllLessonByCid,
  addALessonByCid,
  updateALesson,
  deleteALesson,
} = require("../Controller/Lesson.Controller.js");
const { authenticateToken } = require("../../Middleware/verifyToken.js");

//-------------------------------------------------------------------------------------
// Create a router object using the express.Router() method
const LessonRouter = express.Router();
LessonRouter.use("/me", authenticateToken);

//-------------------------------------------------------------------------------------
//AUTH/REGISTRATION
// Define a route handler for creating a new blog using a POST request to /POST
LessonRouter.route("/:cid").get(getAllLessonByCid).post(addALessonByCid);
LessonRouter.route("/:lesson_id").put(updateALesson).delete(deleteALesson);
// LessonRouter.route("/DELETE").post(CreateACourse);

//-------------------------------------------------------------------------------------
module.exports = LessonRouter;
