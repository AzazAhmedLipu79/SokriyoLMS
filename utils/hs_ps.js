require("dotenv").config();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

//--------------------------------------
const hs = (word) => {
  if (typeof word === "string") {
    const hash = crypto.createHash("sha256");
    hash.update(process.env.SALT + word);
    const hashedPassword = hash.copy().digest("hex");

    return hashedPassword;
  }
  return {
    success: false,
    msg: `${word} must to be a string data type`,
  };
};

//---------------------------------------
// USER INFO WILL TAKE UID & EMAIL AS AN OBJECT - generateAccessToken({ uid: 100025, email: "lipuahmedazaz79@gmail.com" })
const generateAccessToken = (userinfo) =>
  jwt.sign(userinfo, process.env.JWT_SECRET_TOKEN, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

//---------------------------------------

module.exports = { hs, generateAccessToken };
