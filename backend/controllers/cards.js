const Card = require('../models/card');

function handleErr(err, res) {
  if (err.name === 'CastError' || 'ValidationError') {
    res.status(400).send({ message: 'NotValid Data' });
  } else if (err.name === 'DocumentNotFoundError') {
    res.status(404).send({ message: 'Card not found' });
  } else {
    res.status(500).send({ message: 'An error has occurred on the server' });
  }
}

module.exports.getCards = (req, res) => {
  Card.find({})
    .orFail()
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      handleErr(err, res);
    });
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      handleErr(err, res);
    });
};

module.exports.deleteCard = (req, res) => {
  const { id } = req.params;

  Card.findByIdAndRemove(id)
    .orFail()
    .then(() => res.send({ message: 'card deleted' }))
    .catch((err) => {
      handleErr(err, res);
    });
};

module.exports.likeCard = (req, res) => {
  const { id } = req.params;

  Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then(() => res.send({ message: 'like added' }))
    .catch((err) => {
      handleErr(err, res);
    });
};

module.exports.dislikeCard = (req, res) => {
  const { id } = req.params;

  Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then(() => res.send({ message: 'like deleted' }))
    .catch((err) => {
      handleErr(err, res);
    });
};
