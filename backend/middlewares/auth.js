const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const err = new Error('Authorization required');
    err.statusCode = 403;

    next(err);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, '4b0996963f9be042b22513a58bddaa061e7b9639840e0ad6687ebba5797cb992');///////////////////key
  } catch (e) {
    const err = new Error('Authorization required');
    err.statusCode = 401;

    next(err);
  }

  req.user = payload;
  next();
};
