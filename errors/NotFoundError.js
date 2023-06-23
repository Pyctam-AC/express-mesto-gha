const httpConstants = require('http2').constants;
// 404
module.exports = class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpConstants.HTTP_STATUS_NOT_FOUND;
  }
};
