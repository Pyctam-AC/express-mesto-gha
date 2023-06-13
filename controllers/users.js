const httpConstants = require('http2').constants;
const User = require('../models/user');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { id } = req.params;

  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res
          .status(httpConstants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Такой пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Такой пользователь не найден' });
      }
      return next();
    });
};

const createUser = (req, res, next) => {
  const newUserData = req.body;

  return User.create(newUserData)
    .then((newUser) => {
      res.status(201).send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы неверные данные' });
      }
      return next();
    });
};

const updateDataUser = (req, res, next) => {
  const newUserData = req.body;
  return User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        return res
          .status(httpConstants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Такой пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы неверные данный' });
      }
      return next();
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
          .status(httpConstants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Такой пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send(
          { message: 'Переданы неверные данный' },
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
