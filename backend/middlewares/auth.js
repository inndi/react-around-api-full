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
    payload = jwt.verify(token, '4b0996963f9be042b22513a58bddaa061e7b9639840e0ad6687ebba5797cb992');///////////////////key
  } catch (e) {
    const err = new Error('Authorization required');
    err.statusCode = 401;

    next(err);
  }

  req.user = payload;
  next();
};
