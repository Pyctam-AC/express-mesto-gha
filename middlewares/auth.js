/* eslint-disable arrow-body-style */
const jwt = require('jsonwebtoken');
const AuthorisationError = require('../errors/AuthorisationError');

const secretKey = process.env.SECRET_KEY || 'some-secret-key';

const extractBearerToken = (header) => {
  return header.replace('Bearer ', '');
};

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
  //  return handleAuthError(res);
    return next(new AuthorisationError('Неправильные почта или пароль'));
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
  //  return handleAuthError(res);
    return next(new AuthorisationError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};

/* const handleAuthError = (next) => {
  return next(new AuthorisationError('Неправильные почта или пароль'));
};
 */

//  const { authorization } = req.headers;

//  if (!authorization || !authorization.startsWith('Bearer ')) {
//  return handleAuthError(res);

// const token = extractBearerToken(cookies.jwt);
/* const { cookies } = req.headers;
if (!cookies.jwt || !cookies.jwt.startsWith('Bearer ')) {
  return next(new AuthorisationError('Неправильные почта или пароль'));
}
const myData = pm.response.json();
pm.environment.set('token', myData.token)
*/

// const token = extractBearerToken(authorization);

//  return handleAuthError(res);
