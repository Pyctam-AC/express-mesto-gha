const httpConstants = require('http2').constants;
// 500
const errorHandler = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode)
      .send({ message: err.message });
  } else {
    res.status(httpConstants.HTTP_STATUS_SERVER_ERROR)
      .send({ message: err.message || 'На сервере произошла ошибка' });
  }

  next();
};

module.exports = errorHandler;
