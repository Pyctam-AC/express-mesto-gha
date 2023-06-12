const router = require('express').Router();

const {getUsers,
  getUserById,
  createUser,
  updateDataUser,
  updateAvatarUser} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:id', getUserById);

router.post('/', createUser);

router.patch('/me', updateDataUser);

router.patch('/me/avatar', updateAvatarUser);

module.exports = router;
