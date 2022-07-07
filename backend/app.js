const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
let cors = require('cors');

const app = express();
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const {
  createUser,
  login
} = require('./controllers/users');
const auth = require('./middlewares/auth');
const {
  requestLogger,
  errorLogger,
} = require('./middlewares/logger');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.options('*', cors());

mongoose.connect('mongodb://0.0.0.0:27017/test');

app.use(requestLogger);

app.use(helmet());

app.post('/signin',
  // celebrate({
  //   body: Joi.object().keys({
  //     email: Joi.string().required().email(),
  //     password: Joi.string().required().min(8),
  //   }),
  // }),
  login);

app.post('/signup',
  // celebrate({
  //   body: Joi.object().keys({
  //     name: Joi.string().min(2).max(30),
  //     about: Joi.string().min(2).max(30),
  //     email: Joi.string().required().email(),
  //     password: Joi.string().required().min(8),
  //   }).unknown(true),
  // }),
  createUser);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

const { PORT = 3000 } = process.env;

app.get('*', (req, res) => res.status(404).send({ message: 'Requested resource not found' }));

app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  console.log(err.statusCode);
  if (!err.statusCode) {
    console.log('lalalala____', err);
    const { statusCode = 500, message } = err;
    return res
      .status(statusCode)
      .send({
        message: statusCode === 500
          ? 'An error occurred on the server'
          : message
      });
  };
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
