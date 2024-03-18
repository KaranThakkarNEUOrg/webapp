const User = require("../models/user");
const bcrypt = require("bcrypt");
const logger = require("../middleware/logger");
const { log } = require("console");

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})/;

const getUserService = async (req, res) => {
  try {
    logger.info("getUserService: Fetching user details", { severity: "INFO" });
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

module.exports = {
  getUserService,
  createUserService,
  updateUserService,
};
