const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards')

router.get('/', (req, res) => {
  res.send('Hi!')
});

router.get('/*', (req, res) => {
  res.status(404).send({ message: "Такая страница не найдена" })
});

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);


module.exports = router;
