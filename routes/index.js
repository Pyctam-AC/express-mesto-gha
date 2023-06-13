const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const errorServer = require('../middlewares/errorServer');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use('*', (req, res, next) => {
  res.status(404).send({ message: 'Такая страница не найдена' });
  next();
});

router.use(errorServer);

module.exports = router;

/* router.get('/', (req, res) => {
  res.send('Hi!')
}); */
