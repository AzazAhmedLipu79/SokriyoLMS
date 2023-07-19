const { pool } = require("../../Config/database.js");
const { hs, generateAccessToken } = require("../../utils/hs_ps.js");

//-------------------------------------------------------------------------------------
const loginUser = async (req, res, next) => {
  const timestamp = new Date()
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "");
  console.log(timestamp);
  const { email, password } = req.body;
  console.log(email);
  if (email && password) {
    try {
      const hs_ps = await hs(password);
      const userQuery = "SELECT uid, password_hash From user where email = ?";
      const LastLoginQuery =
        "UPDATE user SET last_logged_in = ? WHERE email = ? ";

      const [result, _] = email && (await pool.query(userQuery, [email]));
      const [insertion, o] =
        timestamp && (await pool.query(LastLoginQuery, [timestamp, email]));
      // console.log(result, insertion);
      // console.log(hs_ps);
      // console.log(result[0]?.password_hash);

      if (result[0]?.password_hash && result[0]?.password_hash === hs_ps) {
        // WHEN USER IS VALID

        const token = generateAccessToken({
          uid: result[0]?.uid,
          email,
        });

        let options = {
          maxAge: 1000 * 60 * 5, // would expire after 5 minutes
          httpOnly: true, // The cookie only accessible by the web server
          signed: true, // Indicates if the cookie should be signed
        };

        // Set cookie
        res.cookie("token", token, options); // options is optional

        return res.status(200).json({
          success: true,
          msg: `${result[0]?.uid} founded, login success`,
          token,
        });
      }

      return res.status(400).json({
        success: false,
        msg: "Something Wrong In EMAIL \n Instruction:\n1. If You Don't Have Account Kindly Register\n2.Unless check again email & password, if you can't recover try to recover it using supports",
      });
    } catch (error) {
      // await pool.rollback
      // Handle any errors by passing them to the next error handler middleware
      return next(error);
    }
  } else {
    // Send a bad request response if the title or content is missing
    return res.status(400).json({
      success: false,
      message: "email, password is missing",
    });
  }
};

//-------------------------------------------------------------------------------------
const logoutUser = async (req, res) => {
  res.clearCookie("token");
  return res.status(403).json({ success: false, msg: "USER HAS BEEN LOGOUT" });
};

//-------------------------------------------------------------------------------------

const changePassword = async (req, res, next) => {
  //  IMPLEMENTATION FORGET PASSWORD
  // USER WILL SEND CURRENT PASSWORD AND NEW PASSWORD
  // IF CURRENT PASSWORD IS CORRECT THEN HE WILL ALLOWED TO REPLACE PASSWORD BY NEW PASSWORD
};

//-------------------------------------------------------------------------------------

module.exports = { loginUser, logoutUser, changePassword };
