const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5m
  max: 5,
});

module.exports = rateLimiter;
