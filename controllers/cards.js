const httpConstants = require('http2').constants;
const Card = require('../models/card');

const getCards = (req, res, next) => {
  Card
    .find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const id = req.user._id;

  return Card.create({ name, link, owner: id })
    .then((cards) => {
      res.status(201).send(cards);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return next();
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
        res.status(404).send({ message: 'Такой карточки нет' });
      }
      res.status(200).send(card);
    })
    .catch(() => {
      res.status(400).send({ message: 'Некорректный id карточки' });
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
        res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Такой карточки нет' });
      }
      res.status(200).send(card);
    })
    .catch(() => {
      res.status(400).send({ message: 'Некорректный id карточки' });
    });
};

const deleteCardById = (req, res, next) => {
  const id = req.user._id;

  return Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        return res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Такой карточки нет' });
      }
      if (card.owner.toString() === id) {
        return Card.findByIdAndRemove(req.params.id)
          .then((removeCard) => res.status(200).send(removeCard))
          .catch(next);
      }
      return res.status(400).send({ message: 'Можно удалять только свои карточки' });
    })
    .catch(() => {
      res.status(400).send({ message: 'Некорректный id карточки' });
    });
};

module.exports = {
  getCards,
  createCard,
  likeCardById,
  dislikeCardById,
  deleteCardById,
};
