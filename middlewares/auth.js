const jwt = require('jsonwebtoken');
const ApiError = require('../errors/ApiError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(ApiError.Unauthorized('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, '5439a800e974a13f893bfbac5d9d9e5a81b8de4968ce72fe52b0737123281f0e');
  } catch (err) {
    return next(ApiError.Unauthorized('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};
