const { pool } = require("../../Config/database.js");

//-------------------------------------------------------------------------------------
// Get All Enrollment  - Private - Admin -
const getAllEnrollment = async (req, res, next) => {
  // const courseId = req.params.cid;
  try {
    // const query = "SELECT * FROM Enrollment ORDER BY eid DESC";
    const query =
      "SELECT * FROM Enrollment INNER JOIN Payment ON Enrollment.eid= Payment.eid ORDER BY Enrollment.eid DESC";
    // Execute the query using the connection object and await for the result
    // The result is an array of objects that represent each blog post
    const [allEnrollment, _] = await pool.query(query);
    // Send a success response with the blog data
    if (allEnrollment.length > 0) {
      return res.status(200).json({
        success: true,
        data: allEnrollment,
        msg: `ALL ENROLLEMENT SUCCESSFULLY FETCHED`,
      });
    } else {
      return res.status(400).json({
        success: false,
        msg: `There is No Enrollment records`,
      });
    }
  } catch (error) {
    // Handle any errors by passing them to the next error handler middleware
    return next(error);
  }
};
//-------------------------------------------------------------------------------------
// Get All Enrollment  - Private - Admin -
const getAllEnrollmentByCid = async (req, res, next) => {
  const courseId = req.params.cid;
  try {
    const query =
      "SELECT * FROM Enrollment INNER JOIN Payment ON Enrollment.eid= Payment.eid where cid= ? ORDER BY Enrollment.eid DESC";
    // Execute the query using the connection object and await for the result
    // The result is an array of objects that represent each blog post
    const [allEnrollment, _] = await pool.query(query, [courseId]);
    // Send a success response with the blog data
    console.log(allEnrollment);
    // ETA NIYE VABTE HOBA
    if (allEnrollment.length > 0) {
      return res.status(200).json({
        success: true,
        data: allEnrollment,
        msg: `ALL ENROLLEMENT SUCCESSFULLY FETCHED By CourseID ${courseId}`,
      });
    } else {
      return res.status(200).json({
        success: false,
        msg: `This ${courseId} has no enrollment`,
      });
    }
  } catch (error) {
    // Handle any errors by passing them to the next error handler middleware
    return next(error);
  }
};
//-------------------------------------------------------------------------------------
// Get All Enrollment  - Private - Admin -
const getAllEnrollmentByUid = async (req, res, next) => {
  const user_id = req.params.uid;
  try {
    const query =
      "SELECT * FROM Enrollment INNER JOIN Payment ON Enrollment.eid= Payment.eid where uid= ? ORDER BY Enrollment.eid DESC";
    // Execute the query using the connection object and await for the result
    // The result is an array of objects that represent each blog post
    const [allEnrollment, _] = await pool.query(query, [user_id]);
    // Send a success response with the blog data
    if (allEnrollment.length > 0) {
      return res.status(200).json({
        success: true,
        data: allEnrollment,
        msg: `ALL ENROLLEMENT SUCCESSFULLY FETCHED By UserID ${user_id}`,
      });
    } else {
      return res.status(200).json({
        success: false,
        msg: `User Id - ${user_id} has no enrollment`,
      });
    }
  } catch (error) {
    // Handle any errors by passing them to the next error handler middleware
    return next(error);
  }
};
//-------------------------------------------------------------------------------------
// User Enroll By User Id  - Authorized User (Student, Guardian)
const EnrollCourse = async (req, res, next) => {
  const cid = req.params.cid;
  const { method, payment_by, trxid, paid_from } = req.body;
  // user info = req.user
  const uid = 10000;

  if (method && payment_by && trxid && paid_from) {
    try {
      // Create a query string that selects all records from the blog table
      const EnrollQuery = "INSERT INTO Enrollment (uid,cid) VALUES (?,?)";
      const PaymentQuery =
        "INSERT INTO Payment (eid,method,payment_by,trxid,paid_from) VALUES (?,?,?,?,?)";
      // Execute the query using the connection object and await for the result
      // The result is an array of objects that represent each blog post
      const [result, _] = await pool.query(EnrollQuery, [uid, cid]);

      // Send a success response with the blog data
      if (result.affectedRows) {
        const [insertion, _] = await pool.query(PaymentQuery, [
          result.insertId,
          method,
          payment_by,
          trxid,
          paid_from,
        ]);

        if (insertion.affectedRows) {
          return res.status(200).json({
            success: true,
            msg: `Payment Submitted & ENROLLMENT DONE`,
          });
        }

        return res.status(200).json({
          success: true,
          msg: `Payment Failed DONE`,
        });
      } else {
        return res.status(500).json({
          success: false,
          msg: `ENROLLMENT NOT DONE`,
        });
      }
    } catch (error) {
      // Handle any errors by passing them to the next error handler middleware
      return next(error);
    }
  } else {
    return res.status(400).json({
      success: false,
      msg: "Requirement DataSet is Not Matching",
    });
  }
};
//-------------------------------------------------------------------------------------
// User Enroll By User Id  - Authorized User (Student, Guardian)
const offlineEnrollment = async (req, res, next) => {
  const { uid, cid } = req.body;
  // const method = 3;
  // user info = req.user
  if (uid && cid) {
    try {
      // Create a query string that selects all records from the blog table
      const EnrollQuery =
        "INSERT INTO Enrollment (uid,cid,isApproved) VALUES (?,?,1)";
      const PaymentQuery = "INSERT INTO Payment (eid,method) VALUES (?,3)";
      // Execute the query using the connection object and await for the result
      // The result is an array of objects that represent each blog post
      const [result, _] = await pool.query(EnrollQuery, [uid, cid]);
      console.log(result);
      // Send a success response with the blog data
      if (result.affectedRows) {
        const [insertion, __] = await pool.query(PaymentQuery, [
          result.insertId,
        ]);
        console.log(insertion);

        if (insertion.affectedRows) {
          return res.status(200).json({
            success: true,
            msg: `Payment Submitted & ENROLLMENT DONE`,
          });
        }

        return res.status(200).json({
          success: true,
          msg: `Payment Failed DONE`,
        });
      } else {
        return res.status(500).json({
          success: false,
          msg: `ENROLLMENT NOT DONE`,
        });
      }
    } catch (error) {
      // Handle any errors by passing them to the next error handler middleware
      return next(error);
    }
  } else {
    return res.status(400).json({
      success: false,
      msg: "Requirement DataSet is Not Matching",
    });
  }
};

//-------------------------------------------------------------------------------------
// Approve User Enroll Enrollment  - Private - Payment  - Admin -
const approveEnrollment = async (req, res, next) => {
  const { eid, approve } = req.body;
  const approvement = approve ? 1 : 0;
  try {
    // Create a query string that selects all records from the blog table
    const approveQuery = "Update Enrollment set isApproved = ? where eid = ?";
    // Execute the query using the connection object and await for the result
    // The result is an array of objects that represent each blog post
    const [approveEnroll, _] = await pool.query(approveQuery, [
      approvement,
      eid,
    ]);
    // Send a success response with the blog data
    if (approveEnroll.affectedRows && approvement == 1) {
      return res.status(200).json({
        success: true,
        msg: `${eid} has been successfully approved`,
      });
    } else {
      return res.status(400).json({
        success: false,
        msg: `Something went wrong when during approve process`,
      });
    }
  } catch (error) {
    // Handle any errors by passing them to the next error handler middleware
    return next(error);
  }
};
//-------------------------------------------------------------------------------------
// Approve User Enroll Enrollment  - Private - Payment  - Admin -
const deleteUserEnroll = async (req, res, next) => {
  const { eid } = req.body;
  try {
    // Create a query string that selects all records from the blog table
    const deleteENRQuery = "DELETE FROM Enrollment WHERE eid = ?";
    const deletePAYQuery = "DELETE FROM  Payment WHERE eid = ?";
    // Execute the query using the connection object and await for the result
    // The result is an array of objects that represent each blog post
    const [deletePayment, __] = await pool.query(deletePAYQuery, [eid]);
    const [deleteEnroll, _] = await pool.query(deleteENRQuery, [eid]);

    if (deleteEnroll.affectedRows && deletePayment.affectedRows) {
      return res.status(200).json({
        success: true,
        msg: `${eid} record has been successfully deleted`,
      });
    } else {
      return res.status(400).json({
        success: false,
        msg: `Something went wrong when during deleting process`,
      });
    }
  } catch (error) {
    // Handle any errors by passing them to the next error handler middleware
    return next(error);
  }
};

//-------------------------------------------------------------------------------------
const { updateUserEnroll } = {};
module.exports = {
  getAllEnrollment,
  getAllEnrollmentByCid,
  getAllEnrollmentByUid,
  EnrollCourse,
  updateUserEnroll,
  deleteUserEnroll,
  EnrollCourse,
  approveEnrollment,
  offlineEnrollment,
};
