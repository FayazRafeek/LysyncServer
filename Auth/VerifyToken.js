var jwt = require('jsonwebtoken');
var config = require('./config');

function verifyToken(req, res, next) {

  var token = req.headers['x-access-token'];
  console.log("X-access-token -> " + token);
  if (!token)
    return res.send({ status: false, message: 'No token provided.', errorCode : 111 });
    
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err){
      console.log("ERROR VERIFY => " + err);
      return res.send({ status: false, message: 'Failed to authenticate token.', errorCode : 110 });
    }
    
    console.log("UserId -> " + decoded.id);
    if(!decoded.id){
      return res.send({ status: false, message: 'Failed to authenticate token.', errorCode : 110 });
    }
      
    req.userId = decoded.id
    next();
    
  });
}

module.exports = verifyToken;