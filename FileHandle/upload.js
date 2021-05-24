var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const fileUpload = require('express-fileupload');
const verifyToken = require('../Auth/VerifyToken');

// default options
// router.use(fileUpload());
// router.use('/form', express.static(__dirname + '/index.html'));

router.post('/uploadFile', function(req, res) {

  console.log('Request reached');
  let sampleFile;
  let uploadPath;


  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + ' + sampleFile.name';

  console.log(sampleFile);

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});

module.exports = router;


