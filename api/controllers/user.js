const {
  getUserService,
  createUserService,
  updateUserService,
} = require("../services/user");

const getUser = async (req, res) => {
  await getUserService(req, res);
};

const createUser = async (req, res) => {
  await createUserService(req, res);
};

const updateUser = async (req, res) => {
  await updateUserService(req, res);
};

module.exports = { getUser, createUser, updateUser };
