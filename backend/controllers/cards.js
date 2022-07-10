const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const ValidationError = require('../errors/validation-error');
const AuthorizationError = require('../errors/authorization-error');

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
  const { id, owner } = req.params;
  const ownerId = req.user._id;

  console.log('1', ownerId);
  console.log('2', owner);
  console.log('3', req.params);




  if (ownerId === owner) {
    Card.findByIdAndRemove(id)
      .orFail()
      .then((removed) => {
        if (!removed) {
          throw new AuthorizationError('Authorization required');
        };
        res.send({ message: 'card deleted' });
      })
      .catch(next);
  } else {
    next(new AuthorizationError('Authorization required'));
  };
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
