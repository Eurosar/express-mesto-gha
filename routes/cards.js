const router = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { createCardValidator, idValidator } = require('../validators/celebrate');

router.post('/', createCardValidator, createCard);
router.get('/', getCards);
router.delete('/:cardId', idValidator, deleteCard);
router.put('/:cardId/likes', idValidator, likeCard);
router.delete('/:cardId/likes', idValidator, dislikeCard);

module.exports = router;
