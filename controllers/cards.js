// const httpConstants = require('http2').constants;
const Card = require('../models/card');

const BadRequestErrorr = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

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

  if (!name || !link) {
    throw new BadRequestErrorr('Не переданы данные для создания карточки');
  }

  Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: req.user._id,
  })
    .then((cards) => {
      res.status(201).send(cards);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErrorr('Переданы некорректные данные для создания карточки'));
      } else {
        next(err);
      }
    });
};

const likeCardById = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) return res.status(200).send(card);

      throw new NotFoundError('Такой карточки нет');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestErrorr('Некорректный id карточки'));
      } else {
        next(err);
      }
    });
};

const dislikeCardById = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) return res.status(200).send(card);

      throw new NotFoundError('Такой карточки нет');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestErrorr('Некорректный id карточки'));
      } else {
        next(err);
      }
    });
};

const deleteCardById = (req, res, next) => {
  const id = req.user._id;

  return Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки нет');
      }
      if (card.owner.toString() === id) {
        return Card.findByIdAndRemove(req.params.id)
          .then((removeCard) => res.status(200).send(removeCard));
      }

      throw new ForbiddenError('Можно удалять только свои карточки');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestErrorr('Некорректный id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  likeCardById,
  dislikeCardById,
  deleteCardById,
};
