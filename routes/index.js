const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards')

router.get('/', (req, res) => {
  res.send('Hi!')
});

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.get('*', (req, res) => {
  res.status(404).send({ message: "Такая страница не найдена" })
});

module.exports = router;
