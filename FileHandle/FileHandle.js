var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const fileUpload = require('express-fileupload');
const verifyToken = require('../Auth/VerifyToken');
const fileLogic = require('./File')

router.use(fileUpload());
router.use('/form', express.static(__dirname + '/index.html'));

router.post('/uploadFile',verifyToken, fileLogic.uploadFile)

router.get('/downloadFile', verifyToken, fileLogic.downloadFile)

module.exports = router