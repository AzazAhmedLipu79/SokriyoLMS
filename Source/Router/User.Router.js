const express = require("express");
const {
  registerUser,
  maintainUser,
  bioUpdate,
} = require("../Controller/UserReg.Controller.js");
const {
  loginUser,
  logoutUser,
  changePassword,
} = require("../Controller/UserLog.Controller.js");
const { authenticateToken } = require("../../Middleware/verifyToken.js");

//-------------------------------------------------------------------------------------
// Create a router object using the express.Router() method
const userRouter = express.Router();
userRouter.use("/ME", authenticateToken);

//-------------------------------------------------------------------------------------
// AUTH/LOGIN
userRouter.route("/ME").get((req, res) => {
  console.log(req.user);
  res.json({ msg: "WELCOME TO LOGIN PAGE", user: req?.user });
});

userRouter.route("/LOGIN").post(loginUser);
userRouter.route("/LOGOUT").get(logoutUser);
userRouter.route("/CHANGE_PASSWORD").put(changePassword);
//-------------------------------------------------------------------------------------
//AUTH/REGISTRATION
// Define a route handler for creating a new blog using a POST request to /POST
userRouter.route("/REGISTER").post(registerUser).put(bioUpdate);
// PUT: ACTION BAN - UNBAN
userRouter.route("/REGISTER/Maintain").put(maintainUser);

//-------------------------------------------------------------------------------------
module.exports = userRouter;
