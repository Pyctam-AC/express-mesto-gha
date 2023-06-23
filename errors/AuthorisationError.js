// const httpConstants = require('http2').constants;
// 401
module.exports = class AuthorisationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
};
