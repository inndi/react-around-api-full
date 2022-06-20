const bcrypt = require('bcryptjs');
const User = require('../models/user');

function handleErr(err, res) {
  if (err.name === 'CastError' || 'ValidationError') {
    res.status(400).send({ message: 'NotValid Data' });
  } else if (err.name === 'DocumentNotFoundError') {
    res.status(404).send({ message: 'User not found' });
  } else {
    res.status(500).send({ message: 'An error has occurred on the server' });
  }
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      handleErr(err, res);
    });
};

module.exports.getUser = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      handleErr(err, res);
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then(hash => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => { console.log(user); res.send({ data: user }) })
    .catch((err) => {
      handleErr(err, res);
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const { id } = req.params;

  User.findByIdAndUpdate(
    id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      handleErr(err, res);
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { id } = req.params;

  User.findByIdAndUpdate(
    id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      handleErr(err, res);
    });
};
