const { User, User_Metadata } = require("../models/user");
const bcrypt = require("bcrypt");
const logger = require("../middleware/logger");
const { PubSub } = require("@google-cloud/pubsub");
if (process.env.NODE_ENV !== "test") {
  const pubSubClient = new PubSub({
    projectId: "csye6225-dev-414900",
  });
}

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})/;

const getUserService = async (req, res) => {
  try {
    logger.debug("getUserService: Fetching user details", {
      severity: "DEBUG",
    });
    res.status(200).json({
      id: req.user.id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      username: req.user.username,
      account_created: req.user.account_created,
      account_updated: req.user.account_updated,
    });
    logger.info("getUserService: User details fetched successfully", {
      severity: "INFO",
    });
    logger.debug("getUserService: completed", {
      severity: "DEBUG",
    });
    return;
  } catch (error) {
    logger.error(`getUserService: Error fetching user details: ${error}`, {
      severity: "ERROR",
    });
    return res.status(400).end();
  }
};

const createUserService = async (req, res) => {
  try {
    logger.info("createUserService: Creating new user", { severity: "INFO" });

    let userDetails = req.body;
    const allowedFields = ["first_name", "last_name", "password", "username"];
    const additionalFields = Object.keys(req.body).filter(
      (field) => !allowedFields.includes(field)
    );

    if (additionalFields.length > 0) {
      logger.error(`createUserService: Invalid fields [${additionalFields}]`, {
        severity: "ERROR",
      });
      return res.status(400).json(`Invalid fields [${additionalFields}]`);
    }

    if (!userDetails.password.match(passwordRegex)) {
      logger.error(`createUserService: Invalid password`, {
        severity: "ERROR",
      });
      return res.status(400).json("Invalid password");
    }

    // hashing password
    logger.info("createUserService: Hashing password", { severity: "INFO" });
    userDetails.password = bcrypt.hashSync(
      userDetails.password,
      +process.env.SALT_ROUNDS
    );

    // creating new user
    const user = await User.create(userDetails);

    logger.info(`createUserService: User created successfully`, {
      severity: "INFO",
    });

    const dataBuffer = Buffer.from(
      JSON.stringify({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
      })
    );

    const messageId = await pubSubClient.topic("verify_email").publishMessage({
      data: dataBuffer,
    });

    return res.status(201).json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      account_created: user.account_created,
      account_updated: user.account_updated,
    });
  } catch (error) {
    if (error.name == "SequelizeValidationError") {
      logger.error(`createUserService: Error creating user: ${error.message}`, {
        severity: "ERROR",
      });
      return res.status(400).json({ message: error.message });
    } else if (error.name == "SequelizeUniqueConstraintError") {
      logger.error(
        `createUserService: Error creating user: Username already exists`,
        {
          severity: "ERROR",
        }
      );
      return res.status(409).json({ error: "Username already exists" });
    }
    logger.error(`createUserService: Error creating user: ${error}`, {
      severity: "ERROR",
    });
    return res.status(400).json({ error: error });
  }
};

const updateUserService = async (req, res) => {
  try {
    logger.info("updateUserService: Updating user details", {
      severity: "INFO",
    });
    const { first_name, last_name, password } = req.body;

    const allowedFields = ["first_name", "last_name", "password"];
    const additionalFields = Object.keys(req.body).filter(
      (field) => !allowedFields.includes(field)
    );

    if (additionalFields.length > 0) {
      logger.error(`updateUserService: Invalid fields ${additionalFields}`, {
        severity: "ERROR",
      });
      return res.status(400).json(`Invalid fields ${additionalFields}`);
    }

    if (!password.match(passwordRegex)) {
      logger.error(`updateUserService: Invalid password`, {
        severity: "ERROR",
      });
      return res.status(400).json("Invalid password");
    }

    await User.update(
      {
        first_name,
        last_name,
        password: bcrypt.hashSync(password, +process.env.SALT_ROUNDS),
      },
      {
        where: {
          username: req.user.username,
        },
        returning: true,
      }
    );

    logger.info(`updateUserService: User details updated successfully`, {
      severity: "INFO",
    });

    return res.status(204).end();
  } catch (error) {
    if (error.name == "SequelizeValidationError") {
      logger.error(
        `updateUserService: Error updating user details: ${error.message}`,
        {
          severity: "ERROR",
        }
      );
      return res.status(400).json({ message: error.message });
    } else if (error.name == "SequelizeUniqueConstraintError") {
      logger.error(
        `updateUserService: Error updating user details: Username already exists`,
        {
          severity: "ERROR",
        }
      );
      return res.status(409).json({ error: "Username already exists" });
    }

    logger.error(`updateUserService: Error updating user details: ${error}`, {
      severity: "ERROR",
    });
    return res.status(400).end();
  }
};

const verifyUserService = async (req, res) => {
  try {
    logger.info("verifyUserService: Verifying user", { severity: "INFO" });

    const { id } = req.query;

    if (!id) {
      logger.info("verifyUserService: Id is required", {
        severity: "ERROR",
      });
      return res.status(400).json({ error: "Id is required" });
    }

    const user = await User_Metadata.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      logger.error(
        `verifyUserService: User not created in user_metadata table`,
        {
          severity: "ERROR",
        }
      );
      return res
        .status(404)
        .json({ error: "User not created in user_metadata table" });
    } else {
      if (getTimeDifference(user.timestamp)) {
        logger.error(`verifyUserService: Verification token expired`, {
          severity: "ERROR",
        });
        return res.status(400).json({ error: "Verification token expired" });
      }
    }

    await User.update(
      {
        is_verified: true,
      },
      {
        where: {
          id: id,
        },
      }
    );

    logger.info(`verifyUserService: User verified successfully`, {
      severity: "INFO",
    });

    return res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    logger.error(`verifyUserService: Error verifying user: ${error}`, {
      severity: "ERROR",
    });
    return res.status(400).json({ error: error });
  }
};

const getTimeDifference = (userTimeStamp) => {
  const currentUTCTime = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  const difference = currentUTCTime.getTime() - userTimeStamp.getTime();

  return difference > 2;
};

module.exports = {
  getUserService,
  createUserService,
  updateUserService,
  verifyUserService,
};
