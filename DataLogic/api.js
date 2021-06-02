var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var dataLogic = require('./Data')
var VerifyToken = require('../Auth/VerifyToken');


router.post('/addData', VerifyToken, function(req,res,next){

    var userId = req.userId   

    dataLogic.addData(userId,req.body)
    .then( (r) => {
        dataLogic.notifyUsers(userId,r.notificationMessage)
        .then( r => {
            res.send(r)
        })
        .catch(e => {
            res.send({status : true, successCount : 0})
        })
    })
    .catch( e=>{
        console.log(e);
        res.send({status : false,message : 'Failed to Add Data'})
    })


});


router.get('/getAllDatas', VerifyToken, function(req,res,next){

    dataLogic.getAllData(req.userId)
    .then(r => {

        if(r.status){
            res.send({status : true,output : r.output})
        } else{
            res.send({status : false,message : r.message})
        }
    })
    .catch( e => {
        res.send({status : false,message : 'Failed to get datas'})
    })
});

module.exports = router

