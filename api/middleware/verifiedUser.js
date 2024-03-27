const { User } = require("../models/user");
const logger = require("./logger");

const verifiedUser = async (req, res, next) => {
  if (process.env.NODE_ENV === "test") return next();
  try {
    const { id } = req.query;
    if (!id) {
      logger.info("verifyUserService: Id is required", {
        severity: "ERROR",
      });
      return res.status(400).json({ error: "Id is required" });
    }

    const user = await User.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      logger.error(`verifyUserService: User not found`, {
        severity: "ERROR",
      });
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.is_verified) {
      logger.error(
        `verifyUserService: Please verify your account from the link send on email`,
        {
          severity: "ERROR",
        }
      );
      return res.status(401).json({
        error: "Please verify your account from the link send on email",
      });
    }

    next();
  } catch (error) {
    logger.error(`verifyUserService: ${error.message}`, {
      severity: "ERROR",
    });
    return res.status(401).json({ error: error });
  }
};

module.exports = verifiedUser;
