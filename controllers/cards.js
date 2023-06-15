const httpConstants = require('http2').constants;
const Card = require('../models/card');

const getCards = (req, res) => {
  Card
    .find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      res.status(httpConstants.HTTP_STATUS_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const id = req.user._id;

  return Card.create({ name, link, owner: id })
    .then((cards) => {
      res.status(201).send(cards);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(httpConstants.HTTP_STATUS_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const likeCardById = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(httpConstants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Такой карточки нет' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Некорректный id карточки' });
      }
      return res.status(httpConstants.HTTP_STATUS_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const dislikeCardById = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Такой карточки нет' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Некорректный id карточки' });
      }
      return res.status(httpConstants.HTTP_STATUS_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const deleteCardById = (req, res) => {
  const id = req.user._id;

  return Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        return res.status(httpConstants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Такой карточки нет' });
      }
      if (card.owner.toString() === id) {
        return Card.findByIdAndRemove(req.params.id)
          .then((removeCard) => res.status(200).send(removeCard));
      }
      return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'Можно удалять только свои карточки' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Некорректный id карточки' });
      }
      return res.status(httpConstants.HTTP_STATUS_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports = {
  getCards,
  createCard,
  likeCardById,
  dislikeCardById,
  deleteCardById,
};
