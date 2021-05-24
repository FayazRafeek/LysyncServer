var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var firestore = require('../Firebase/firestore');
var fcm = require('../Firebase/fcm')
var VerifyToken = require('../Auth/VerifyToken');
var notify = require('./notify')

router.post('/addData', VerifyToken, function(req, res, next) {
  
    var uId = req.userId;
    var data = req.body.data

    firestore.addData(uId,data)
    .then((result) => {
        notify.notifyDataAdd(uId,data)
        .then( result2 => {
            res.send({status : true})
        })
        .catch(error => {
            res.send({status : false})
        })
    })
    .catch(e => {
        res.send({status : false})
    })

});


router.get('/getAllDatas', VerifyToken, function(req, res, next) {
  
    var uId = req.userId;
    console.log(uId);

    firestore.getAllDatas(uId)
    .then((result) => {
        res.status(200).send(result.output)
    })
    .catch(e => {
        res.status(400).send(e)
    })

});

module.exports = router

