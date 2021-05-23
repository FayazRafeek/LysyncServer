
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('./config')

var firestore = require('../Firebase/firestore');
var VerifyToken = require('./VerifyToken');

router.post('/register', function(req, res) {
  
    var name = req.body.name;
    var email = req.body.email;
    var pass = req.body.password;
    var hashedPassword = bcrypt.hashSync(pass, 8)

    firestore.addUser(name,email,hashedPassword)
    .then((result) => {

        var token = jwt.sign({ id: result }, config.secret);

        firestore.updateToken(result,token)
        .then((result2) => {
            res.status(200).send({status : true, token : token})
        })
        .catch((err2) => {
            res.status(400).send({status : false, message : 'Failed toget Auth token'})
        })
    }).catch((err) => {
        console.log(err);
        res.status(404).send({status : false, message : 'Failed to register user'})
    })

});


router.get('/me', VerifyToken, function(req, res, next) {
    firestore.getUser(req.userId)
      .then((result) => {
          if(result.exists){
            var uId = result.id
            var email = result.data().email;
            var name = result.data().name;
            res.status(200).send({name : name,email : email});
          }
          else
            res.status(404).send("User Does not Exist");
      })
      .catch((e) => {
        res.status(400).send("Error");
      })
});

router.post('/login', function(req, res) {

    var email = req.body.email;
    var pass = req.body.password;

    firestore.getUserWithEmail(email)
    .then((result) => {
        if(result.status){
            var user = result.user
            console.log(user);
            var hashPass = user.data().pass;
            var passwordIsValid = bcrypt.compareSync(pass, hashPass);

            console.log(email);
            console.log(pass)

            if(passwordIsValid){

                console.log('Password valid');
                var uId = user.id

                var token = jwt.sign({ id: uId }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                    });

                firestore.updateToken(uId,token)
                .then(r => {
                    console.log('Token Updated');
                    res.status(200).send({status : true, token : token})
                })
                .catch(e => {
                    console.log(e);
                    res.status(400).send({status : false, message : 'Failed to get auth token'})
                })

            } else {  
                console.log("Password invalid");
                res.status(400).send({status : false, message : 'Password Invalid'})
            }
        } else {
            console.log('No invalid');
            res.status(404).send({status : false, message : result.message})
        }
    })
    .catch((e) => {
        console.log(e);
        res.status(404).send({auth : false, message : 'Failed toget user'})
    })
});



module.exports = router;
