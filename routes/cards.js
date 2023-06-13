const router = require('express').Router();

const {
  getCards,
  createCard,
  likeCardById,
  dislikeCardById,
  deleteCardById,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', createCard);

router.put('/:id/likes', likeCardById);

router.delete('/:id/likes', dislikeCardById);

router.delete('/:id', deleteCardById);

module.exports = router;
