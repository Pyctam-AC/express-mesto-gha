/* eslint-disable arrow-body-style */
const jwt = require('jsonwebtoken');
const AuthorisationError = require('../errors/AuthorisationError');

const handleAuthError = (next) => {
  return next(new AuthorisationError('Неправильные почта или пароль'));
};

const extractBearerToken = (header) => {
  return header.replace('Bearer ', '');
};

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next();
};
