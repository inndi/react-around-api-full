const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const err = new Error('Authorizationnnnnnssss required');
    err.statusCode = 403;

    next(err);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'key');
  } catch (e) {
    const err = new Error('Authorizationnnnnnnssss required');
    err.statusCode = 403;

    next(err);
  }

  req.user = payload;
  next();
}
