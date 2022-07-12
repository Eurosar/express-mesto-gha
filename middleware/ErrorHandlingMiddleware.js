const ApiError = require('../errors/ApiError');

const errorHandler = (err, req, res, next) => {
  // Если ошибка относится к ApiError
  if (err instanceof ApiError) {
    // Вернем статус ошибки и ее сообщение согласно настройкам
    return res.status(err.status).json({ message: err.message });
  }
  // Иначе вернем 500 ошибку
  return next(res.status(500).json({ message: 'Непредвиденная ошибка!' }));
};

module.exports = errorHandler;
