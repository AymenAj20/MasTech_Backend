const jwt = require('jsonwebtoken');

const createToken = (payload,secret) =>
  jwt.sign({ userId: payload }, secret, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

module.exports = createToken;