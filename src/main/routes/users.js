const ls = require('local-storage');

const userSchema = require('../models/user');
const { findUser, getUpdatedUser, getNewUser } = require('../utils/userUtils');
const { notFoundError, badRequestError } = require('../utils/errorUtils');

/**
 * Creates new user and adds to local storage
 * @param {Object} req - request
 * @param {Object} res - response
 */
const createUser = async (req, res) => {
  const users = ls.get('users') || [];

  const user = getNewUser(req.body);

  users.push(user);
  ls.set('users', users);
  res.send(users);
};

/**
 * Returns a list of all users from local storage
 * @param {Object} req - request
 * @param {Object} res - response
 */
const readUsers = async (req, res) => {
  const users = ls.get('users') || [];
  res.send(users);
};

/**
 * Updates user in local storage using id
 * @param {Object} req - request
 * @param {Object} res - response
 */
const updateUser = async (req, res) => {
  const users = ls.get('users') || [];

  const user = findUser(users, req.params.id);

  if (!user) {
    notFoundError(res, 'The user with the given ID was not found.');
  }

  const updatedUsers = users && users.map((u) => {
    if (u.id === req.params.id) {
      u = getUpdatedUser(u, req.body); // eslint-disable-line no-param-reassign
      res.send(u);
    }
    return u;
  });

  ls.set('users', updatedUsers);
};

/**
 * Deletes user from local storage using id
 * @param {Object} req - request
 * @param {Object} res - response
 */
const deleteUser = (req, res) => {
  const users = ls.get('users') || [];

  const user = findUser(users, req.params.id);

  if (!user) {
    notFoundError(res, 'The user with the given ID was not found.');
  } else {
    const index = users.indexOf(user);
    users.splice(index, 1);
    res.send(user);
  }

  ls.set('users', users);
};

const validateUser = (req, res, next) => {
  const { error, value } = userSchema.validate(req.body);

  if (error) {
    const message = `Validation error: ${error.details.map((x) => x.message).join(', ')}`
    badRequestError(res, message);
  } else {
    req.body = value;
    next();
  }
};

module.exports = {
  createUser,
  readUsers,
  updateUser,
  deleteUser,
  validateUser,
};
