const Card = require('../models/card');
const ApiError = require('../errors/ApiError');

/**
 * Создаем карточку
 * @param req
 * @param res
 * @param next
 */
module.exports.createCard = (req, res, next) => {
  // Деструктурируем отправленные значения пользователем
  const { name, link } = req.body;
  // Временно присваиваем хардкорно id пользователя
  const owner = req.user._id;
  // Создаем карточку с именем, ссылкой и id пользователя
  Card.create({ name, link, owner })
    // Если ошибок нет, то возвращаем полученную карточку со статусом 201
    .then((card) => res.status(201).send({ data: card }))
    // Иначе показываем ошибки
    .catch((err) => {
      // Если ошибка относится к ValidationError
      if (err.name === 'ValidationError') {
        // то возвращаем ошибку 400
        return next(ApiError.BadRequestError('Переданы некорректные данные при создании карточки.'));
      }
      // Иначе возвращаем ошибку 500
      return next(ApiError.InternalError('Произошла ошибка'));
    });
};

/**
 * Получаем все карточки из БД
 * @param req
 * @param res
 * @param next
 */
module.exports.getCards = (req, res, next) => {
  // Находим все карточки в БД
  Card.find({})
    // Если ошибок нет, то возвращаем массив карточек со статусом 200
    .then((cards) => res.status(200).send({ data: cards }))
    // Иначе возвращаем ошибку 500
    .catch(() => next(ApiError.InternalError('Произошла ошибка')));
};

/**
 * Удаляем карточку
 * @param req
 * @param res
 * @param next
 */
module.exports.deleteCard = (req, res, next) => {
  // Деструктурируем введенные параметры в командную строку
  const { cardId } = req.params;
  // Найдем и удалим нужную карточку по id
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      // Если карточка не найдена, то возвращаем ошибку 404
      if (!card) {
        return next(ApiError.NotFoundError('Карточка с указанным _id не найдена.'));
      }
      // Если найдена, то возвращаем статус 204
      return res.status(204);
    })
    // Иначе вызываем ошибку 500
    .catch(() => next(ApiError.InternalError('Произошла ошибка')));
};

/**
 * Ставим like карточке
 * @param req
 * @param res
 * @param next
 */
module.exports.likeCard = (req, res, next) => {
  // Деструктурируем введенные параметры в командную строку
  const { cardId } = req.params;
  // Найдем и обновим нужную карточку по id
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      // Если карточка не найдена
      if (!card) {
        // вернем ошибку 404
        return next(ApiError.NotFoundError('Передан несуществующий _id карточки.'));
      }
      // Иначе вернем обновленную карточку с присвоенным like
      return res.status(200).send({ data: card });
    })
    // Иначе вернем ошибки
    .catch((err) => {
      // Если ошибка относится к ValidationError
      if (err.name === 'ValidationError') {
        // то возвращаем ошибку 400
        return next(ApiError.BadRequestError('Переданы некорректные данные для постановки лайка.'));
      }
      // Иначе возвращаем ошибку 500
      return next(ApiError.InternalError('Произошла ошибка'));
    });
};

/**
 * Убираем like у карточки
 * @param req
 * @param res
 * @param next
 */
module.exports.dislikeCard = (req, res, next) => {
  // Деструктурируем введенные параметры в командную строку
  const { cardId } = req.params;
  // Найдем и обновим нужную карточку по id
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      // Если карточка не найдена
      if (!card) {
        // вернем ошибку 404
        return next(ApiError.NotFoundError('Передан несуществующий _id карточки.'));
      }
      // Иначе вернем обновленную карточку с удаленным like
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      // Если ошибка относится к ValidationError
      if (err.name === 'ValidationError') {
        // то возвращаем ошибку 400
        return next(ApiError.BadRequestError('Переданы некорректные данные для снятия лайка.'));
      }
      // Иначе возвращаем ошибку 500
      return next(ApiError.InternalError('Произошла ошибка'));
    });
};