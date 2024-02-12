const User = require("../models/user");
const bcrypt = require("bcrypt");

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})/;

const getUserService = async (req, res) => {
  try {
    return res.status(200).json({
      id: req.user.id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      username: req.user.username,
      account_created: req.user.account_created,
      account_updated: req.user.account_updated,
    });
  } catch (error) {
    return res.status(400).end();
  }
};

const createUserService = async (req, res) => {
  try {
    let userDetails = req.body;
    const allowedFields = ["first_name", "last_name", "password", "username"];
    const additionalFields = Object.keys(req.body).filter(
      (field) => !allowedFields.includes(field)
    );

    if (additionalFields.length > 0) {
      return res.status(400).json(`Invalid fields [${additionalFields}]`);
    }

    if (!userDetails.password.match(passwordRegex)) {
      return res.status(400).json("Invalid password");
    }

    // hashing password
    userDetails.password = bcrypt.hashSync(
      userDetails.password,
      +process.env.SALT_ROUNDS
    );

    // creating new user
    const user = await User.create(userDetails);

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
      return res.status(400).json({ message: error.message });
    } else if (error.name == "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Username already exists" });
    }
    return res.status(400).json({ error: error });
  }
};

const updateUserService = async (req, res) => {
  try {
    const { first_name, last_name, password } = req.body;

    const allowedFields = ["first_name", "last_name", "password"];
    const additionalFields = Object.keys(req.body).filter(
      (field) => !allowedFields.includes(field)
    );

    if (additionalFields.length > 0) {
      return res.status(400).json(`Invalid fields ${additionalFields}`);
    }

    if (!password.match(passwordRegex)) {
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

    return res.status(204).end();
  } catch (error) {
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
