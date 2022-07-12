const User = require('../models/user');
const ApiError = require('../errors/ApiError');

/**
 * Создаем пользователя
 * @param req
 * @param res
 * @param next
 */
module.exports.createUser = (req, res, next) => {
  // Деструктурируем данные, полученные от клиента
  const { name, about, avatar } = req.body;
  // Создает пользователя в БД
  User.create({ name, about, avatar })
    // Если все в порядке, вернем готовый объект со статусом 201
    .then((user) => res.status(201).send({ data: user }))
    // Иначе
    .catch((err) => {
      // Если ошибка относится к ValidationError
      if (err.name === 'ValidationError') {
        // Возвращаем 400 ошибку
        return next(ApiError.BadRequestError('Переданы некорректные данные при создании пользователя.'));
      }
      // Иначе возвращаем 500 ошибку
      return next(ApiError.InternalError('Произошла ошибка'));
    });
};

/**
 * Получаем всех пользователей
 * @param req
 * @param res
 * @param next
 */
module.exports.getUsers = (req, res, next) => {
  // Ищем всех пользователей в БД
  User.find({})
    // Если все в порядке
    .then((users) => {
      // Возвращаем массив пользователей
      res.status(200).send({ data: users });
    })
    // Иначе возвращаем 500 ошибку
    .catch(() => next(ApiError.InternalError('Произошла ошибка')));
};

/**
 * Получаем пользователя по id
 * @param req
 * @param res
 * @param next
 */
module.exports.getUser = (req, res, next) => {
  // Деструктурируем введенные параметры в командную строку
  const { userId } = req.params;
  // Найдем пользователя по id
  User.findById(userId)
    .then((user) => {
      // Если пользователь не найден
      if (!user) {
        // Вернем 404 ошибку
        return next(ApiError.NotFoundError('Пользователь по указанному _id не найден'));
      }
      // Иначе вернем объект пользователя
      return res.status(200).send({ data: user });
    })
    // Иначе вернем 500 ошибку
    .catch(() => next(ApiError.InternalError('Произошла ошибка')));
};

/**
 * Обновляем данные пользователя
 * @param req
 * @param res
 * @param next
 */
module.exports.updateUserProfile = (req, res, next) => {
  // Деструктурируем введенные данные клиентом
  const { name, about } = req.body;
  // Временно присваиваем хардкорно id пользователя
  const id = req.user._id;
  // обновим имя найденного по id пользователя
  User.findByIdAndUpdate(
    id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      // upsert: true, // если пользователь не найден, он будет создан
    },
  )
    .then((user) => {
      // Если пользователь не найден
      if (!user) {
        // Вернем 404 ошибку
        return next(ApiError.NotFoundError('Пользователь с указанным _id не найден.'));
      }
      // Иначе вернем обновленный объект пользователя
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      // Если ошибка относится к ValidationError
      if (err.name === 'ValidationError') {
        // Вернем 400 ошибку
        return next(ApiError.BadRequestError('Переданы некорректные данные при создании пользователя.'));
      }
      // Иначе вернем 500 ошибку
      return next(ApiError.InternalError('Произошла ошибка'));
    });
};

/**
 * Обновляем аватар пользователя
 * @param req
 * @param res
 * @param next
 */
module.exports.updateUserAvatar = (req, res, next) => {
  // Деструктурируем введенные данные клиентом
  const { avatar } = req.body;
  // Временно присваиваем хардкорно id пользователя
  const id = req.user._id;
  // обновим имя найденного по id пользователя
  User.findByIdAndUpdate(
    id,
    {
      avatar,
    },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      // Если пользователь не найден
      if (!user) {
        // Вернем 404 ошибку
        return next(ApiError.NotFoundError('Пользователь с указанным _id не найден.'));
      }
      // Иначе вернем обновленный объект пользователя
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      // Если ошибка относится к ValidationError
      if (err.name === 'ValidationError') {
        // Вернем 400 ошибку
        return next(ApiError.BadRequestError('Переданы некорректные данные при создании пользователя.'));
      }
      // Иначе вернем 500 ошибку
      return next(ApiError.InternalError('Произошла ошибка'));
    });
};
