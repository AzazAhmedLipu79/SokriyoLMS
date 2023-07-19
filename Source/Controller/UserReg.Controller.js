require("dotenv").config();
const { pool } = require("../../Config/database.js");
const { hs, generateAccessToken } = require("../../utils/hs_ps.js");

/* 
The function takes in the req and res objects from an Express.js route.
The function extracts the fname, email, password, and number properties from the request body.
The function checks if all four properties are present.
If all four properties are present, the function hashes the password using the hs() function (not shown).
The function then creates two SQL queries: one to insert the user’s email and hashed password into the user table, and another to insert the user’s name, number, and user ID into the bio table.
The function then executes the two queries using the pool.query() method (not shown).
If both queries are successful, the function returns a JSON response with a 201 status code and a success message.
If either query fails, the function returns a JSON response with a 500 status code and an error message.
If any of the four required properties are missing, the function returns a JSON response with a 400 status code and an error message.
*/
const registerUser = async (req, res, next) => {
  const { fname, email, password, number } = req.body;

  if (fname && email && password && number) {
    try {
      const hs_ps = hs(password);
      const userQuery = "INSERT INTO user (email, password_hash) VALUES(?, ?)";
      const bioQuery =
        "INSERT INTO bio (fname, phone_number, uid) VALUES(?,?,?)";

      const [result, _] = await pool.query(userQuery, [email, hs_ps]);

      if (result?.insertId) {
        const [result2, _] = await pool.query(bioQuery, [
          fname,
          number,
          result.insertId,
        ]);
        if (result2?.insertId) {
          const token = generateAccessToken({
            uid: result.insertId,
            email,
          });

          let options = {
            maxAge: 1000 * 60 * 5, // would expire after 5 minutes
            httpOnly: true, // The cookie only accessible by the web server
            signed: true, // Indicates if the cookie should be signed
          };

          // Set cookie
          res.cookie("token", token, options); // options is optional

          return res.status(201).json({
            success: true,
            USERId: result.insertId,
            token,
          });
        }
      }
      return res.status(500).json({
        success: false,
        msg: "Something error occurng when data inserted to our server, we're assuming you're facing network issues, Try Later",
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
      message: "fname, email, password, number is missing",
    });
  }
};

//-------------------------------------------------------------------------------------
// USER DELETE - ADMIN

//-------------------------------------------------------------------------------------
// USER INFORMATION UPDATE - STUDENT

const bioUpdate = async (req, res, next) => {
  const { uid, fname, number, dof, fb, address } = req.body;

  if (fname && number && dof && fb && address) {
    try {
      const bioUpdateQuery =
        "UPDATE bio SET fname = ?,phone_number = ?,dof = ?,fb = ?,address = ? WHERE uid = ?;";

      const [result, _] = await pool.query(bioUpdateQuery, [
        fname,
        number,
        dof,
        fb,
        address,
        uid,
      ]);
      console.log(result, _);

      if (result?.changedRows) {
        return res.status(200).json({
          success: true,
          msg: `${uid} updated successfully`,
        });
      }
    } catch (error) {
      // Handle any errors by passing them to the next error handler middleware
      console.log(error);
      return next(error);
    }
  } else {
    // Send a bad request response if the title or content is missing
    return res.status(400).json({
      success: false,
      message: "didn't provided any data for update",
    });
  }
};

//-------------------------------------------------------------------------------------
// USER BAN UNBAN - TO Ban user role is to set as 04 - ADMIN

const maintainUser = async (req, res, next) => {
  const { uid, action } = req.body;
  // Expected from action : BAN or UNBAN
  let status = action == "UNBAN" ? "1" : "4";
  if (uid) {
    try {
      const banQuery = "UPDATE user SET roles = ? WHERE uid = ?;";

      const [result, _] = await pool.query(banQuery, [status, uid]);
      console.log(result, _);

      if (result?.changedRows) {
        return res.status(200).json({
          success: true,
          msg: `${uid} successfully ${
            action == "UNBAN" ? "unbanned" : "banned"
          }`,
        });
      } else {
        return res.status(400).json({
          success: false,
          msg: `${uid} has already been ${
            action == "UNBAN" ? "unbanned" : "banned"
          } . `,
        });
      }
    } catch (error) {
      // Handle any errors by passing them to the next error handler middleware
      return next(error);
    }
  } else {
    // Send a bad request response if the title or content is missing
    return res.status(400).json({
      success: false,
      message: "user id is missing",
    });
  }
};

//-------------------------------------------------------------------------------------

module.exports = { registerUser, maintainUser, bioUpdate };
