const router = require('express').Router();

const {
  getUsers,
  getUserById,
  getDataUser,
  updateDataUser,
  updateAvatarUser,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/me', getDataUser);

router.get('/users/:id', getUserById);

router.patch('/users/me', updateDataUser);

router.patch('/users/me/avatar', updateAvatarUser);

module.exports = router;
