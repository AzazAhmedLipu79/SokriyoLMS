const rateLimit = require("express-rate-limit");
require("dotenv").config();

const limiter = rateLimit({
  windowMs: 60 * 1000 * 10, // 1 minute
  max: process.env.RATE_LIMIT || 1, // Limit each IP to 25 requests per 60sec
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    msg: "To many requests from your network, try after a minute",
  },
});

module.exports = limiter;
