var jwt = require('jsonwebtoken');
var config = require('./config');

function verifyToken(req, res, next) {

  var token = req.headers['x-access-token'];
  console.log("X-access-token -> " + token);
  if (!token)
    return res.send({ status: false, message: 'No token provided.', errorCode : 111 });
    
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
    return res.send({ status: false, message: 'Failed to authenticate token.', errorCode : 110 });
      
    // if everything good, save to request for use in other routes
    console.log("Decoded -> " + decoded);
    req.userId = decoded.id;
    console.log("\n\nReq Bodu ==> " + JSON.stringify(req.body));
    next();
    
  });
}

module.exports = verifyToken;