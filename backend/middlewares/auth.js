const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  console.log('auth', authorization);

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const err = new Error('Authorization required');
    err.statusCode = 403;

    next(err);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  console.log('tok', token);

  try {
<<<<<<< HEAD
    payload = jwt.verify(token, JWT_SECRET);///////////////////key
=======
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');///////////////////key
>>>>>>> 0d608b821a2a3232d8413b114104027db2166e2e
  } catch (e) {
    const err = new Error('Authorization required');
    err.statusCode = 401;

    next(err);
  }

  req.user = payload;
  next();
};
