const { pool } = require("../../Config/database.js");

//-------------------------------------------------------------------------------------
// Get All Lesson By Course Id - Private - Enrolled User
const getAllLessonByCid = async (req, res, next) => {
  const courseId = req.params.cid;
  try {
    // Create a query string that selects all records from the blog table
    const query =
      "SELECT lesson_id, content_type, title, content FROM Lesson where cid = ?";
    // Execute the query using the connection object and await for the result
    // The result is an array of objects that represent each blog post
    const [lessons, _] = await pool.query(query, [courseId]);
    // Send a success response with the blog data
    if (lessons.length > 0) {
      return res.status(200).json({
        success: true,
        data: lessons,
        msg: `Lessons Successfully Fetched From Course Id ${courseId}`,
      });
    } else {
      return res.status(400).json({
        success: false,
        msg: `No Data Found From Course Id ${courseId}`,
      });
    }
  } catch (error) {
    // Handle any errors by passing them to the next error handler middleware
    return next(error);
  }
};

//-------------------------------------------------------------------------------------
// Add Lesson By Course Id  - Admin - Manager
const addALessonByCid = async (req, res, next) => {
  const courseId = req.params.cid;
  const { title, content_type, content, origin } = req.body;
  if (!title && content_type && (content || origin)) {
    return res.status(400).json({
      success: false,
      msg: "Information missing - check title, content_type, content or origin ",
    });
  }
  try {
    const LessonQuery =
      "INSERT INTO Lesson ( cid, title,content_type,content) VALUES( ?,?, ?, ?);";
    // Create a query string that selects all records from the blog table
    const CourseQuery = "SELECT slug FROM course where cid = ? ";

    // Execute the query using the connection object and await for the result
    // The result is an array of objects that represent each blog post
    const [course, _] = await pool.query(CourseQuery, [courseId]);
    if (course[0]?.slug) {
      // ADD DATA TO LESSON TABLE

      const [result, _] = await pool.query(LessonQuery, [
        courseId,
        title,
        content_type,
        content,
      ]);
      if (result?.affectedRows) {
        return res.status(201).json({
          success: true,
          lesson: result.insertId,
          msg: "Lesson Added Successfully",
        });
      } else {
        return res.status(500).json({
          success: false,
          msg: "Lesson COULD NOT BE ADDED",
          courseId: result.insertId,
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        msg: "Invalid Course ID",
      });
    }
  } catch (error) {
    // Handle any errors by passing them to the next error handler middleware
    return next(error);
  }
};

//-------------------------------------------------------------------------------------
// Update Lesson By Course Id  - Admin - Manager
const updateALesson = async (req, res, next) => {
  const lessonId = req.params.lesson_id;

  const { title, standing = 1, content_type, content } = req.body;

  try {
    // Create a query string that selects all records from the blog table
    const LessonQuery =
      "UPDATE lesson SET title = ?, standing= ?, content_type = ?, content= ? WHERE lesson_id =?;";
    // Execute the query using the connection object and await for the result
    // The result is an array of objects that represent each blog post
    const [result, _] = await pool.query(LessonQuery, [
      title,
      standing,
      content_type,
      content,
      lessonId,
    ]);
    console.log(result);

    // Send a success response with the blog data

    if (result.affectedRows) {
      return res.status(200).json({
        success: true,
        msg: `Lesson Id :${lessonId}  is Successfully Updated`,
        info: result.info,
      });
    } else {
      return res.status(400).json({
        success: false,
        msg: "Invalid Lesson Id",
        info: result.info,
      });
    }
  } catch (error) {
    // Handle any errors by passing them to the next error handler middleware
    return next(error);
  }
};

//-------------------------------------------------------------------------------------
// Delete Lesson By Course Id  - Admin - Manager
const deleteALesson = async (req, res, next) => {
  const lessonId = req.params.lesson_id;
  try {
    // Create a query string that selects all records from the blog table
    const deleteLesson = "DELETE FROM lesson WHERE lesson_id = ?";
    // Execute the query using the connection object and await for the result
    // The result is an array of objects that represent each blog post
    const [result, _] = await pool.query(deleteLesson, [lessonId]);
    console.log(result);
    // Send a success response with the blog data
    if (result.affectedRows) {
      return res.status(200).json({
        success: true,
        data: `Lesson Id :${lessonId} has deleted successfully`,
      });
    } else {
      return res.status(400).json({
        success: false,
        data: `Something wrong in ${lessonId}`,
      });
    }
  } catch (error) {
    // Handle any errors by passing them to the next error handler middleware
    return next(error);
  }
};

//-------------------------------------------------------------------------------------

module.exports = {
  getAllLessonByCid,
  addALessonByCid,
  updateALesson,
  deleteALesson,
};
