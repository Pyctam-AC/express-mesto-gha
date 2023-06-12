const Card = require('../models/card')

const getCards = (req, res) => {
  return Card.find({})
      .then((cards) => {
        return res.status(200).send(cards)
      })
}

const createCard = (req, res) => {
  const { name, link } = req.body;
  const id = req.user;

  return Card.create({ name, link, owner: id})
    .then((cards) => {
      return res.status(201).send(cards)
    })
}

const likeCardById = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Такой карточки нет" });
      } else {
        return res.status(200).send(card);
      }
    })
    .catch((err) => {
      return res.status(500).send({ message: "Server Error" });
    });
};

const dislikeCardById = (req, res) => {
  return Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .then((card) => {
    if (!card) {
      return res.status(404).send({ message: "Такой карточки нет" });
    } else {
      return res.status(200).send(card);
    }
  })
  .catch((err) => {
    return res.status(500).send({ message: "Server Error" });
  });
}

const deleteCardById = (req, res) => {
  //const { cardId } = req.params;
  const id = req.user._id;

  return Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        return res
        .status(404)
        .send({ message: "Такой карточки нет" });
      }
      //сравниваем id создателя карточки и пользователя
      if (card.owner.toString() === id) {
        return Card.findByIdAndRemove(req.params.id)
          .then((removeCard) => res.status(200).send(removeCard))
          .catch((err) => {
            return res.status(500).send(err.message);
          });
      } else {
        return res.status(400).send({ message: "Можно удалять только свои карточки" });
      }
    })
    .catch((err) => {
      return res.status(500).send(err.message);
    });
}

module.exports = {
  getCards,
  createCard,
  likeCardById,
  dislikeCardById,
  deleteCardById
};
