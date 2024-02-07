const bcrypt = require("bcrypt");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  try {
    const [username, password] = Buffer.from(
      req.headers.authorization.split(" ")[1],
      "base64"
    )
      .toString()
      .split(":");

    const user = await User.findOne({
      where: {
        username,
      },
    });

    const isPasswordMatch =
      user && bcrypt.compareSync(password, user?.password);

    if (!isPasswordMatch) {
      return res.status(401).end();
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).end();
  }
};

module.exports = authMiddleware;
