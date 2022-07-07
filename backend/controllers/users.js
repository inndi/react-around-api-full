const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/not-found-error');
const ValidationError = require('../errors/validation-error');
const AuthorizationError = require('../errors/authorization-error');
const { NODE_ENV, JWT_SECRET } = process.env;


// function handleErr(err, res) {
//   if (err.name === 'CastError' || 'ValidationError') {
//     res.status(400).send({ message: err });
//   } else if (err.name === 'DocumentNotFoundError') {
//     throw new NotFoundError('No user with matching ID found');
//   } else {
//     res.status(500).send({ message: 'An error has occurred on the server' });
//   }
// }
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .orFail()
    .then((users) => {
      if (!users) {
        throw new NotFoundError('No users found');
      };
      res.send({ data: users });
    })
    .catch(next);
};

// module.exports.getUser = (req, res, next) => {
//   const { id } = req.params;///////////////////////////
//   console.log(id);

//   User.findById(id)

//     .then((user) => {
//       // console.log(user);
//       if (!user) {
//         throw new NotFoundError('No user with matching ID found');
//       };
//       res.send({ data: user });
//     })
//     .catch(next);
// };

module.exports.getCurrentUser = (req, res, next) => {
  const id = req.user._id;

  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('No user with matching ID found');
      };
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  console.log('ha');

  return bcrypt.hash(password, 10)
    .then(hash => User.create({ name, about, avatar, email, password: hash }))


    .then((user) => {
      console.log('reg', user);///////////////////////////////////
      if (!user) {
        const err = new Error('An email already exists');
        err.statusCode = 409;

        throw err;
      };
      res.send(user);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(
    id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (!user) {
        throw new ValidationError('Invalid data');
      };
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(
    id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (!user) {
        throw new ValidationError('Invalid data');
      };
      res.send({ data: user });
    })
    .catch(next);
};



module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  console.log('user_____', email);///////////////////////////////////////

  User.findUserByCredentials(email, password)
    .then((user) => {
      console.log('user_____', user);/////////////////////////////////////
      if (!user) {
        throw new AuthorizationError('Incorrect password or email');
      };
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' }
      );
      console.log(token);////////////////////////////////////////
      res.send({ token });
    })
    .catch(next);

};
