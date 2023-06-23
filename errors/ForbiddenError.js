const httpConstants = require('http2').constants;
// 403
module.exports = class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpConstants.HTTP_STATUS_FORBIDDEN;
  }
};
