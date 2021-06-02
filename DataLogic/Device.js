var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var firestore = require('../Firebase/firestore');
var fcm = require('../Firebase/fcm');
var VerifyToken = require('../Auth/VerifyToken');

router.post('/addDevice', VerifyToken, function(req, res, next) {
  
    var uId = req.userId;
    var deviceId = req.body.deviceId;
    var deviceType = req.body.type;
    var devicName = req.body.name;
    var fcmToken = req.body.fcmToken;

    const device = {
        deviceId : deviceId,
        deviceType : deviceType,
        devicName : devicName,
        fcmToken : fcmToken
    }

    firestore.addDevice(uId,device)
    .then((result) => {
        res.send({status : true})
    })
    .catch(e => {
        res.send({status : false})
    })

});


router.delete('/removeDevice/:deviceId', VerifyToken, function(req, res, next) {
  
    var uId = req.userId;
    var deviceId = req.params.deviceId;

    firestore.removeDevice(uId,deviceId)
    .then((result) => {
        res.send({status : true})
    })
    .catch(e => {
        res.send({status : false})
    })

});

module.exports = router