const { pool } = require("../../Config/database.js");
const slugify = require("slugify");
const { roles, roleManage } = require("../../utils/role_check.js");

//-------------------------------------------------------------------------------------
// Get All Course - Public
const getAllCourse = async (req, res, next) => {
  try {
    // Create a query string that selects all records from the blog table
    const query = "SELECT * FROM course";
    // Execute the query using the connection object and await for the result
    // The result is an array of objects that represent each blog post
    const courses = await pool.query(query);

    // Send a success response with the blog data
    return res.status(200).json({
      success: true,
      data: courses[0],
    });
  } catch (error) {
    // Handle any errors by passing them to the next error handler middleware
    return next(error);
  }
};

//-------------------------------------------------------------------------------------
// Create A Course - Admin

const CreateACourse = async (req, res, next) => {
  if (
    !(req.user.userRole == roles.ADMIN || req.user.userRole == roles.Manager)
  ) {
    return res.status(400).json({
      success: false,
      message: "only permitted user can create course",
    });
  }

  const {
    title,
    description,
    thumbnail,
    duration,
    deadline,
    price,
    content,
    blog_id,
  } = req.body;
  if (
    title &&
    description &&
    thumbnail &&
    duration &&
    deadline &&
    price &&
    content &&
    blog_id
  ) {
    try {
      const slug =
        (await slugify(title, {
          lower: true,
          strict: true,
          trim: true,
        })) +
        "-" +
        Date.now();
      const CourseQuery =
        "INSERT INTO course ( title,short_description,thumbnail,duration,deadline,price,content,BLOG_ID,slug) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);";

      const [result, _] = await pool.query(CourseQuery, [
        title,
        description,
        thumbnail,
        duration,
        deadline,
        price,
        content,
        blog_id,
        slug,
      ]);
      if (result?.affectedRows) {
        return res.status(201).json({
          success: true,
          courseId: result.insertId,
          msg: "Course Added Successfully",
        });
      } else {
        return res.status(500).json({
          success: false,
          msg: "COURSE COULD NOT BE ADDED",
          courseId: result.insertId,
        });
      }
    } catch (error) {
      console.log(error);
      return next(error);
    }
  } else {
    return res.status(400).json({
      success: false,
      message:
        "Title, Description, Thumbnail,Duration,Deadline,Price,What_You_Learn,Blog_id is missing",
    });
  }
};

//-------------------------------------------------------------------------------------
// Update A Course - Admin

const UpdateACourse = async (req, res, next) => {
  if (
    !(req.user.userRole == roles.ADMIN || req.user.userRole == roles.Manager)
  ) {
    return res.status(400).json({
      success: false,
      message: "only permitted user can create course",
    });
  }
  // Get Course Id or Slug Get
  // Search Course Record By It
  // Update ✅
  const slug = req.params.slug;
  const isActive = req.body?.isActive ? 1 : 0;
  const {
    title,
    description,
    thumbnail,
    duration,
    deadline,
    price,
    content,
    blog_id,
  } = req.body;
  if (
    title &&
    description &&
    thumbnail &&
    duration &&
    deadline &&
    price &&
    content &&
    blog_id &&
    slug
  ) {
    try {
      const UpCourseQuery =
        "UPDATE course SET title = ?, short_description = ?, thumbnail = ?, duration = ?, deadline = ?, price = ?, content = ?, BLOG_ID = ?, isActive = ? WHERE slug =?;";

      const [result, _] = await pool.query(UpCourseQuery, [
        title,
        description,
        thumbnail,
        duration,
        deadline,
        price,
        content,
        blog_id,
        isActive,
        slug,
      ]);
      console.log(result);
      if (result?.affectedRows) {
        return res.status(201).json({
          success: true,
          courseId: result.insertId,
          msg: "Course updated Successfully",
        });
      } else {
        return res.status(500).json({
          success: false,
          msg: "COURSE COULD NOT BE UPDATED",
          courseId: result.insertId,
          more: result?.info,
        });
      }
    } catch (error) {
      console.log(error);
      return next(error);
    }
  } else {
    return res.status(400).json({
      success: false,
      message:
        "Title, Description, Thumbnail,Duration,Deadline,Price,What_You_Learn,Blog_id is missing",
    });
  }
};

//-------------------------------------------------------------------------------------
// Get Course By Slug - Public
const getCourseBySlug = async (req, res, next) => {
  // Use req.params.id instead of req.params("id") to get the id from the route parameter
  const slug = req.params.slug;
  if (slug) {
    try {
      const result = await pool.query(
        `SELECT * From course
          WHERE slug = ?;`,
        [slug]
      );
      // Check if the result is empty or not, and send a 404 response if the blog is not found
      if (result[0].length === 0) {
        res.status(404).json({ success: true, message: "Course Not Found" });
      } else {
        res.json({ success: true, data: result[0] });
      }
    } catch (error) {
      next(error);
    }
  } else {
    // Use a consistent spelling of "No" in the error message
    res.status(400).send({
      success: false,
      message: "INVALID SLUG",
    });
  }
};

//-------------------------------------------------------------------------------------

module.exports = {
  getAllCourse,
  CreateACourse,
  UpdateACourse,
  getCourseBySlug,
};
