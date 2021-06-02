
// ROUTR
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//   ..

// ENCRYPTION
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('./config')
// ...

// MOdules
var firestore = require('../Firebase/firestore');
var VerifyToken = require('./VerifyToken');
// ...

// Config
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client("722882434328-b32vhighjiv3d39afqoi5d1r6fut3qnc.apps.googleusercontent.com");
// ..

router.post('/register', function(req, res) {
  
    var name = req.body.name;
    var email = req.body.email;
    var pass = req.body.password;

    if(email && name && pass) {
        var hashedPassword = bcrypt.hashSync(pass, 8)
        firestore.getUserWithEmail(email)
        .then( r => {

            if(r.status)
                return res.send({status : false, message : "User Already Exist. Try logging in..",errorCode : 101})
    
            firestore.addUser(name,email,hashedPassword)
            .then((result) => {
                var token = jwt.sign({ id: result }, config.secret);
                res.send({status : true, token : token})
            }).catch((err) => {
                console.log(err);
                res.send({status : false, message : 'Failed to register user',errorCode : 102})
            })

        })
        .catch( e => {
            firestore.addUser(name,email,hashedPassword)
            .then((result) => {
                var token = jwt.sign({ id: result }, config.secret);
                res.send({status : true, token : token})
            }).catch((err) => {
                console.log(err);
                res.send({status : false, message : 'Failed to register user',errorCode : 102})
            })
        })
    } else {
        return res.send({status : false, message : 'Invalid Inputs',errorCode : 103})
    }

});


router.post('/registerGUser',function(req,res) {

    var token = req.body.token
     client.verifyIdToken({
        idToken: token,
        audience: "845438271296-ojslhuuns67itfu9hnj18nasq1nkpggg.apps.googleusercontent.com"
    }).then( r => {

        if(r){
            var email = r.getPayload().email
            var name = r.getPayload().name
            var uId = r.getPayload().sub

            firestore.getUserWithEmail(email)
            .then((result) => {
                if(result.status)
                    return res({status : false, message : "User Already Exist, Try logging in", errorCode : 101})
                else
                    firestore.addGUser(name,email,uId)
                     .then( r => {
                        if(r){
                            var token = jwt.sign({ id: uId }, config.secret, {
                                expiresIn: 86400 // expires in 24 hours
                                });

                            return res.send({status : true, token : token})
                        } else {
                            return res({status : false, message : "Failed to Add User", errorCode : 102})
                        }
                    
                     })
            }).catch( e => {
                firestore.addGUser(name,email,uId)
                .then( r => {
                   if(r){
                       var token = jwt.sign({ id: uId }, config.secret, {
                           expiresIn: 86400 // expires in 24 hours
                           });

                       return res.send({status : true, token : token})
                   } else {
                       return res({status : false, message : "Failed to Add User", errorCode : 102})
                   }
               
                })
            })
    
        }
    })
    .catch( e => {
        return res({status : false, message : "Goolge token invalid", errorCode : 104})
    })
        
})


router.get('/getUser', VerifyToken, function(req, res, next) {

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

            if(passwordIsValid){
                
                var uId = user.id

                var token = jwt.sign({ id: uId }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                    });

                res.status(200).send({status : true, token : token})

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

router.post('/loginGUser', function(req, res) {

    var token = req.body.token
    client.verifyIdToken({
       idToken: token,
       audience: "845438271296-ojslhuuns67itfu9hnj18nasq1nkpggg.apps.googleusercontent.com"
    }).then( r => {

       if(r){
           var email = r.getPayload().email

           firestore.getUserWithEmail(email)
            .then((result) => {
                if(result.status){

                    var user = result.user.data()
                    var uId = user.id
                    var name = user.name

                    var token = jwt.sign({ id: uId }, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                        });

                    res.status(200).send({status : true, token : token, name : name})

                } else {
                    return res.status(404).send({status : false, message : result.message})
                }
            })
            .catch((e) => {
                console.log(e);
                res.status(404).send({status : false, message : 'Failed to get user'})
            })

       }
    })
    .catch( e => {

    })
});


module.exports = router;
