const checkContentLength = async (req, res, next) => {
  if (req.headers["content-length"]?.length > 0) {
    return res.status(400).end();
  }
  next();
};

module.exports = checkContentLength;
