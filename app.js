const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const idHandler = require('./middleware/IdHandlingMiddleware');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

// Соединяемся с БД
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Запускаем приложение в express
const app = express();

// Запускаем парсер
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Временно хардкодим id пользователя
app.use(idHandler);
// Выводим роуты
app.use('/', router);
// Обработка ошибок, должен быть последним Middleware
app.use(errorHandler);

// Запускаем слушатель порта
app.listen(PORT, () => {
  console.log(`app connected server with PORT:${PORT}`);
});
