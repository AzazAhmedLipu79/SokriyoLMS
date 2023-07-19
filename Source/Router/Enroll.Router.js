const express = require("express");
const {
  getAllEnrollment,
  getAllEnrollmentByCid,
  getAllEnrollmentByUid,
  EnrollCourse,
  updateUserEnroll,
  deleteUserEnroll,
  approveEnrollment,
  offlineEnrollment,
} = require("../Controller/Enrollment.Controller.js");
const { authenticateToken } = require("../../Middleware/verifyToken.js");

//-------------------------------------------------------------------------------------
// Create a router object using the express.Router() method
const EnrollRouter = express.Router();
EnrollRouter.use("/Me ", authenticateToken);

//-------------------------------------------------------------------------------------
//Enroll
// Define Enrollment
EnrollRouter.route("/")
  .get(getAllEnrollment)
  .put(approveEnrollment)
  .post(offlineEnrollment)
  .delete(deleteUserEnroll);
EnrollRouter.route("/course/:cid")
  .get(getAllEnrollmentByCid)
  .post(EnrollCourse);
EnrollRouter.route("/user/:uid").get(getAllEnrollmentByUid);
// .put(updateUserEnroll)

//-------------------------------------------------------------------------------------
module.exports = EnrollRouter;
