const { v4: uuidv4 } = require('uuid');

/**
 * Returns user from array using id provided
 * @param {Array} users - array of users
 * @param {string} id - id of user to find
 * @returns {Object | undefined} user object or undefined if user does not exist
 */
const findUser = (users, id) => users && users.find((u) => u.id === id);

/**
 * Returns new user object using request body
 * @param {Object} body - request body
 * @returns {Object} - new user object
 */
const getNewUser = (body) => ({
    id: uuidv4(),
    email: body.email,
    givenName: body.givenName,
    familyName: body.familyName,
    created: new Date(Date.now()).toISOString(),
});

/**
 * Returns updated user object using request body
 * @param {Object} user - existing user object
 * @param {Object} body - request body
 * @returns {Object} updated user object
 */
const getUpdatedUser = (user, body) => ({
    ...user,
    email: body.email,
    givenName: body.givenName,
    familyName: body.familyName,
    updated: new Date(Date.now()).toISOString(),
});

module.exports = {
    findUser,
    getNewUser,
    getUpdatedUser
};