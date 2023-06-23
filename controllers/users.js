const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const httpConstants = require('http2').constants;
const User = require('../models/user');
const AuthorisationError = require('../errors/AuthorisationError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const BadRequestErrorr = require('../errors/BadRequestError');

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestErrorr('Не передан email или пароль');
  }

  return User.findUserByCredentials(email, password, next)
    .then((user) => {
      if (user) {
        const token = jwt.sign(
          { _id: user._id },
          'some-secret-key',
          { expiresIn: '7d' },
        );
        res.send({ token, user });
      }
      throw new AuthorisationError('Неправильные почта или пароль');
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestErrorr('Не передан email или пароль');
  }

  return bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((newUser) => {
      res.status(201).send(newUser);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Попробуйте ввести другие данные для регистрации'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestErrorr('Переданы неверные данные'));
      } else {
        next(err);
      }
    });
};

const getUserById = (req, res, next) => {
  const { id } = req.params;

  return User.findById(id)
    .then((user) => {
      if (user) return res.status(200).send(user);

      throw new NotFoundError('Такой пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestErrorr('Ну нет, так нет'));
      } else {
        next(err);
      }
    });
};

const getDataUser = (req, res, next) => {
  const id = req.user._id;

  return User.findById(id)
    .then((user) => {
      if (user) return res.status(200).send(user);

      throw new NotFoundError('Такой пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestErrorr('Ну нет, так нет'));
      } else {
        next(err);
      }
    });
};

const updateDataUser = (req, res, next) => {
  const newUserData = req.body;
  return User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) return res.status(200).send(user);

      throw new NotFoundError('Такой пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErrorr('Переданы неверные данные'));
      } else {
        next(err);
      }
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
      if (user) return res.status(200).send(user);

      throw new NotFoundError('Такой пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErrorr('Переданы неверные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  login,
  getUsers,
  getUserById,
  createUser,
  getDataUser,
  updateDataUser,
  updateAvatarUser,
};
