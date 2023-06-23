const httpConstants = require('http2').constants;
// 409
module.exports = class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpConstants.HTTP_STATUS_CONFLICT;
  }
};
