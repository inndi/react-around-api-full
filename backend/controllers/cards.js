const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const ValidationError = require('../errors/validation-error');
const AuthorizationError = require('../errors/authorization-error');

// function handleErr(err, res) {
//   if (err.name === 'CastError' || 'ValidationError') {
//     res.status(400).send({ message: 'NotValid Data' });
//   } else if (err.name === 'DocumentNotFoundError') {
//     res.status(404).send({ message: 'Card not found' });
//   } else {
//     res.status(500).send({ message: 'An error has occurred on the server' });
//   }
// }

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .orFail()
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('No cards found');
      };
      res.send(cards);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => {
      if (!card) {
        throw new ValidationError('Invalid data');
      }
      res.send({ data: card });

    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { id } = req.params;

  Card.findByIdAndRemove(id)
    .orFail()
    .then((removed) => {
      if (!removed) {
        throw new AuthorizationError('Authorization required');
      };
      res.send({ message: 'card deleted' });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { id } = req.params;

  Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  const { id } = req.params;

  Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};
