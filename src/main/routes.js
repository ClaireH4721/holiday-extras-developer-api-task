const express = require('express');

const {
  createUser, readUsers, updateUser, deleteUser, validateUser,
} = require('./routes/users');

const router = express.Router();

/**
 * POST/CREATE
 * Creates new user and adds them to existing users
 */
router.post('/', validateUser, createUser);

/**
 * GET/READ
 * Returns list of all users
 */
router.get('/', readUsers);

/**
 * PUT/UPDATE
 * Updates an existing user
 */
router.put('/:id', validateUser, updateUser);

/**
 * DELETE
 * Removes an existing user
 */
router.delete('/:id', deleteUser);

module.exports = router;
