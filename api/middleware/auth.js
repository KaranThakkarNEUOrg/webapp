const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const logger = require("./logger");

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
      logger.error(`authMiddleware: Invalid username or password`, {
        severity: "ERROR",
      });
      return res.status(401).end();
    } else if (!user.is_verified && process.env.NODE_ENV !== "test") {
      logger.error(
        `authMiddleware: Please verify your account from the link send on email`,
        {
          severity: "ERROR",
        }
      );
      return res.status(403).json({
        error: "Please verify your account from the link send on email",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    logger.error(`authMiddleware: ${error.message}`, {
      severity: "ERROR",
    });
    return res.status(401).end();
  }
};

module.exports = authMiddleware;
