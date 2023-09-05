const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const signupRouter = require('./routes/signup');
const signinRouter = require('./routes/signin');

const auth = require('./middlewares/auth');
const { handleError } = require('./errors/error-handling');
const { NotFoundError } = require('./errors/not-found-error');
const {
  requestLogger,
  errorLogger,
} = require('./middlewares/logger');

const { DB_ADDRESS } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.options('*', cors());

mongoose.connect(DB_ADDRESS);

app.use(requestLogger);
app.use(helmet());

app.use('/signup', signupRouter);
app.use('/signin', signinRouter);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

const { PORT = 3000 } = process.env;

app.get('*', (req, res) => next(new NotFoundError('Requested resource not found')));

app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => { handleError(err, res); });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
