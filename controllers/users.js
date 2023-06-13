const User = require('../models/user');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        return res.status(404).send({ message: 'Пользователи не найдены' });
      }
      return res.status(200).send(users);
    })
    .catch(next);
};

const getUserById = (req, res) => {
  const { id } = req.params;

  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: 'Такой пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch(() => {
      res.status(400).send({ message: 'Такой пользователь не найден' });
    });
};

const createUser = (req, res, next) => {
  const newUserData = req.body;

  return User.create(newUserData)
    .then((newUser) => {
      res.status(200).send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы неверные данные' });
      }
      return next();
    });
};

const updateDataUser = (req, res) => {
  const newUserData = req.body;
  return User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: 'Такой пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы неверные данный' });
      }
      return res.status(400).send({ message: 'Server Error' });
    });
};

const updateAvatarUser = (req, res, next) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: 'Такой пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send(
          { message: 'Server Error' },
        );
      }
      return next();
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateDataUser,
  updateAvatarUser,
};
