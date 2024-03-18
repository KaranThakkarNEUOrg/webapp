const logger = require("../middleware/logger");

const checkContentLength = async (req, res, next) => {
  if (req.headers["content-length"]?.length > 0) {
    logger.warn(`Invalid request to /healthz endpoint. Content not allowed`, {
      severity: "WARNING",
    });
    return res.status(400).end();
  }
  next();
};

module.exports = checkContentLength;
