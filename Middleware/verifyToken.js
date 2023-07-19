require("dotenv").config();
const jwt = require("jsonwebtoken");
const { pool } = require("../Config/database.js");

const authenticateToken = (req, res, next) => {
  // const rol_ = 3;
  const authHeader = req.headers?.cookie;

  const decodedCookieValue = decodeURIComponent(
    authHeader?.replace("s%3A", "")
  );
  let token = decodedCookieValue && decodedCookieValue.split("=")[1];
  token =
    token &&
    token.split(".")[0] + "." + token.split(".")[1] + "." + token.split(".")[2];

  if (token == null)
    return res.status(401).json({ success: false, msg: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET_TOKEN, async (err, user) => {
    const userQuery = "SELECT roles From user where email = ?";
    if (err?.message == "jwt expired") {
      res.clearCookie("token");
      return res.status(403).json({ success: false, msg: "TOKEN EXPIRED" });

      /* 
    IF WANT TO RECREATE ACCESS TOKEN
    const token = generateAccessToken({
        uid: user.uid,
        email: user.email,
      });

      let options = {
        // maxAge: 1000 * 60 * 5, // would expire after 5 minutes
        httpOnly: true, // The cookie only accessible by the web server
        signed: true, // Indicates if the cookie should be signed
      };

      // Set cookie
      res.cookie("token", token, options); // options is optional
      req.user = user;

      next(); */
    }

    if (err)
      return res.status(403).json({ success: false, msg: "WRONG TOKEN" });

    try {
      const [result, _] = await pool.query(userQuery, [user?.email]);
      const userRole = result[0]?.roles;

      req.user = { ...user, userRole };
      // if (rol_ <= userRole) {
      next();
      // } else {
      //   res.status(500).json({
      //     success: false,
      //     msg: "Unauthorized",
      //   });
      // }
    } catch (error) {
      next(error);
    }
  });
};

module.exports = { authenticateToken };
