/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/* const validator = require('validator'); */

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак Иф',
    minlength: 2,
    maxlength: 30,
    validate: {
      validator: ({ length }) => length >= 2 && length <= 30,
      message: 'Необходимо ввести от 2 до 30 символов',
    },
  },
  about: {
    type: String,
    default: 'В очках и красной шапочке',
    minlength: 2,
    maxlength: 30,
    validate: {
      validator: ({ length }) => length >= 2 && length <= 30,
      message: 'Необходимо ввести от 2 до 30 символов',
    },
  },
  avatar: {
    type: String,
    default: 'https://scientificrussia.ru/images/y/2kxy-full.jpg',
    validate: {
      validator: (url) => /https?:\/\/(?:[-\w]+\.)?([-\w]+)\.\w+(?:\.\w+)?\/?.*/i.test(url),
      message: 'Не корректная ссылка',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => /\w+@\w+\.\w+/.test(v),
      message: 'Не корректный email-адрес',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    select: false,
    validate: {
      validator: ({ length }) => length >= 4,
      message: 'Пароль должен быть не меньше 4 символов',
    },
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

// убираем пароль из ответа при создании пользователя
userSchema.set('toJSON', {
  transform(req, res) {
    delete res.password;
    return res;
  },
});

module.exports = mongoose.model('user', userSchema);
