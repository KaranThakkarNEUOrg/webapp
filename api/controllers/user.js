const {
  getUserService,
  createUserService,
  updateUserService,
  verifyUserService,
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

const verifyUser = async (req, res) => {
  await verifyUserService(req, res);
};

module.exports = { getUser, createUser, updateUser, verifyUser };
