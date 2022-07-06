const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AuthorizationError = require('../errors/authorization-error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: "Jacques Cousteau",
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: "Explorer"
  },
  avatar: {
    type: String,
    validate: {
      validator: function (v) {
        return /^https?:\/\/[\w.]*[\w\W]+\.[\w\W]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid address!`,
    },
    default: "https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return validator.isEmail(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      console.log(user);
      if (!user) {
        return Promise.reject(new AuthorizationError('Incorrect password or email'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthorizationError('Incorrect password or email'));
          }
          return user;
        })
    })
};

module.exports = mongoose.model('user', userSchema);
