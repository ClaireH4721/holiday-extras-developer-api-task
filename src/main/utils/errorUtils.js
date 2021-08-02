const { NOT_FOUND, BAD_REQUEST } = require("../constants/error");

/**
 * Sends error response
 * @param {Object} res - response
 * @param {string} message - error message
 * @param {Object} type - error type e.g. { status: 400, description: BAD_REQUEST }
 */
const error = (res, message, type) => {
    res.status(type.status).send({
        ...type,
        message
      });
};

/**
 * Sends Not Found error response
 * @param {Object} res - response
 * @param {string} message - error message
 */
const notFoundError = (res, message) => {
    error(res, message, NOT_FOUND);
};

/**
 * Sends Bad Request error response
 * @param {Object} res - response
 * @param {string} message - error message
 */
const badRequestError = (res, message) => {
    error(res, message, BAD_REQUEST);
};

module.exports = {
    notFoundError,
    badRequestError
}