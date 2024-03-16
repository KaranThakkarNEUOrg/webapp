const User = require("../models/user");
const bcrypt = require("bcrypt");
const logger = require("../middleware/logger");

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})/;

const getUserService = async (req, res) => {
  try {
    logger.info("getUserService: Fetching user details");
    return res.status(200).json({
      id: req.user.id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      username: req.user.username,
      account_created: req.user.account_created,
      account_updated: req.user.account_updated,
    });
  } catch (error) {
    logger.error(`getUserService: Error fetching user details: ${error}`);
    return res.status(400).end();
  }
};

const createUserService = async (req, res) => {
  try {
    logger.info("createUserService: Creating new user");

    let userDetails = req.body;
    const allowedFields = ["first_name", "last_name", "password", "username"];
    const additionalFields = Object.keys(req.body).filter(
      (field) => !allowedFields.includes(field)
    );

    if (additionalFields.length > 0) {
      logger.error(`createUserService: Invalid fields [${additionalFields}]`);
      return res.status(400).json(`Invalid fields [${additionalFields}]`);
    }

    if (!userDetails.password.match(passwordRegex)) {
      logger.error(`createUserService: Invalid password`);
      return res.status(400).json("Invalid password");
    }

    // hashing password
    logger.info("createUserService: Hashing password");
    userDetails.password = bcrypt.hashSync(
      userDetails.password,
      +process.env.SALT_ROUNDS
    );

    // creating new user
    const user = await User.create(userDetails);

    logger.info(`createUserService: User created successfully`);

    return res.status(201).json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      account_created: user.account_created,
      account_updated: user.account_updated,
    });
  } catch (error) {
    logger.error(`createUserService: Error creating user: ${error}`);
    if (error.name == "SequelizeValidationError") {
      return res.status(400).json({ message: error.message });
    } else if (error.name == "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Username already exists" });
    }
    return res.status(400).json({ error: error });
  }
};

const updateUserService = async (req, res) => {
  try {
    logger.info("updateUserService: Updating user details");
    const { first_name, last_name, password } = req.body;

    const allowedFields = ["first_name", "last_name", "password"];
    const additionalFields = Object.keys(req.body).filter(
      (field) => !allowedFields.includes(field)
    );

    if (additionalFields.length > 0) {
      logger.error(`updateUserService: Invalid fields ${additionalFields}`);
      return res.status(400).json(`Invalid fields ${additionalFields}`);
    }

    if (!password.match(passwordRegex)) {
      logger.error(`updateUserService: Invalid password`);
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

    logger.info(`updateUserService: User details updated successfully`);

    return res.status(204).end();
  } catch (error) {
    logger.error(`updateUserService: Error updating user details: ${error}`);
    if (error.name == "SequelizeValidationError") {
      return res.status(400).json({ message: error.message });
    } else if (error.name == "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Username already exists" });
    }
    return res.status(400).end();
  }
};

module.exports = {
  getUserService,
  createUserService,
  updateUserService,
};
