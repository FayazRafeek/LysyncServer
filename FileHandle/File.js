const AWS = require('aws-sdk');
const ID = 'AKIAURXC5IGG2R4TI2DA';
const SECRET = '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';

const { v4: uuidv4 } = require('uuid');

const fs = require('fs')

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

const dataLogic = require('../DataLogic/Data')

function uploadFile(req,res,next){

    let inputFile;

    var userId = req.userId 
    var fileName = req.body.fileName
    var type = req.body.type
    var size = req.body.size

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({error : true,message : "No files found"});
    }

    inputFile = req.files.file;

    var fileUri = "Users/" + userId + "/" + fileName + new Date().getMilliseconds()

    const params = {
      Bucket: 'lysyncbucket',
      Key: fileUri, // File name you want to save as in S3
      Body: inputFile.data
    };

    s3.upload(params, function(err, data) {

      if (err) {
        return res.send('Error uploading');
      }

      var payload = {
        url = fileUri,
        type : type,
        fileName : fileName,
        size : size
      }

      dataLogic.addData(userId,payload)
      .then( r=> {
        if(r && r.status)
          dataLogic.notifyUsers(userId,res.payload)
          .then( r => {
              res.send(r)
          })
          .catch(e => {
              res.send({status : true, successCount : 0})
          })
        else
          res.send({status : false, message : 'File upload failed'});

      })
      .catch( e => {
        res.send({status : false, message : 'File upload failed'});
      })
  });

}

function downloadFile(req, res) {

    var userId = req.userId
    var url = req.body.url
    var type = req.body.type
    var fileName = req.body.fileName

    var params = {
      Key: url,
      Bucket: 'lysyncbucket'
    }

    s3.getObject(params, function(err, data) {

        if (err) {
            res.send('Download error')
        }

        var tempUri = "./static/" + userId + "/" + fileName + "." + type;

        fs.writeFileSync(tempUri, data.Body)
        res.download(tempUri,fileName + "." + type)
        fs.unlinkSync(tempUri)

    })
}


module.exports.uploadFile = uploadFile
module.exports.downloadFile = downloadFile
