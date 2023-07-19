require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    multipleStatements: true,
  })
  .promise();

module.exports = { pool };
// const result = await pool.query("SELECT * from blog");
// console.log(result[0].map((x) => x?.title));
