const httpConstants = require('http2').constants;
// 400
module.exports = class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpConstants.HTTP_STATUS_BAD_REQUEST;
  }
};
