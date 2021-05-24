var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const fileUpload = require('express-fileupload');
const verifyToken = require('../Auth/VerifyToken');

const AWS = require('aws-sdk');
const ID = 'AKIAURXC5IGG2R4TI2DA';
const SECRET = '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';

var fs = require('fs');
const { log } = require('console');

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});


// default options
router.use(fileUpload());
router.use('/form', express.static(__dirname + '/index.html'));

router.post('/uploadFile', function(req, res) {

  console.log('Request reached');
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + ""

  console.log(uploadPath);
  console.log(sampleFile);

  // Use the mv() method to place the file somewhere on your server
  // sampleFile.mv(uploadPath, function(err) {
  //   if (err)
  //     return res.status(500).send(err);

  //     const fileContent = fs.readFileSync(uploadPath);

  //     // Setting up S3 upload parameters
  //     const params = {
  //         Bucket: 'lysyncbucket',
  //         Key: fileName, // File name you want to save as in S3
  //         Body: fileContent
  //     };
    
    
  //     s3.upload(params, function(err, data) {
  //       if (err) {
  //         res.send('Error uploading');
  //       }
  //       res.send('File uploaded!');
  //       console.log(`File uploaded successfully. ${data.Location}`);
  //   });
  // });


    // Setting up S3 upload parameters
    const params = {
        Bucket: 'lysyncbucket',
        Key: 'sampleFile.txt', // File name you want to save as in S3
        Body: sampleFile
    };


    s3.upload(params, function(err, data) {
      if (err) {
        res.send('Error uploading');
      }
      res.send('File uploaded!');
      console.log(`File uploaded successfully. ${data.Location}`);
  });

});

router.get('/downloadFile', function(req, res) {

  const fileName = req.params.name;
  const directoryPath =  __dirname;

  res.download(directoryPath + '\\upload.js', 'server.js', (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  })
})

module.exports = router;


