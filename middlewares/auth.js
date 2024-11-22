const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: 'https://www.googleapis.com/oauth2/v3/certs', 
});

function getKey(header, callback) {
  if (header.kid) {
    client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        return callback(err);  
      }
      const signingKey = key.getPublicKey();  
      callback(null, signingKey); 
    });
  } else {
    const defaultKey = process.env.JWT_SECRET;  
    if (!defaultKey) {
      return callback(new Error('JWT_SECRET not defined'));  
    }
    callback(null, defaultKey);  
  }
}

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];  

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  jwt.verify(token, getKey, { algorithms: ['RS256', 'HS256'] }, (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err.message);
      return res.status(401).json({ msg: 'Token is not valid' });
    }

    req.user = decoded;  
    console.log('Decoded token:', decoded); 
    next();  
  });
};
