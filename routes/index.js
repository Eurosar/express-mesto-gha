const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('/', (req, res) => {
  res.status(400).send({ message: 'Адреса не существует' });
});

module.exports = router;
