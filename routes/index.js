const router = require('express').Router();
const httpConstants = require('http2').constants;
const { errors } = require('celebrate');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const authRoutes = require('./auth');
const auth = require('../middlewares/auth');
const errorHandler = require('../middlewares/errorHandler');

router.use('/', authRoutes);
router.use(auth);
router.use('/', userRoutes);
router.use('/cards', cardRoutes);

router.use('*', (req, res, next) => {
  res.status(httpConstants.HTTP_STATUS_NOT_FOUND)
    .send({ message: 'Такая страница не найдена' });
  next();
});

router.use(errors());
router.use(errorHandler);

module.exports = router;
