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

    console.log("UserID : " + userId);
    console.log("Filename : " + fileName);
    console.log("Req Body : " + req.body);


    if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({error : true,message : "No files found"});
    }

    inputFile = req.files.file;

    console.log("Input files => " + inputFile);
    console.log("Else File => " + req.file);


    
    res.send({error: false,message : "" , image : "Image"})




    // const params = {
    //   Bucket: 'lysyncbucket',
    //   Key: "user/" + userId + "/" + fileName, // File name you want to save as in S3
    //   Body: inputFile.data
    // };

    //   s3.upload(params, function(err, data) {
    //     if (err) {
    //      return res.send('Error uploading');
    //     }

    //     dataLogic.addData(userId,data.Location)
    //     .then( r=> {
    //       if(r && r.status)
    //         dataLogic.notifyUsers(userId,data.Location)
    //         .then( r => {
    //           return  res.send({error : false, message : "", image : data.Location});
    //         })
    //         .catch( e => {
    //           return  res.send({error : true, message : "Not send", image : fileName});
    //         })
    //       else
    //         res.send('File upload Failed!');

    //     })
    //     .catch( e => {
    //       res.send('File upload Failed!');
    //     })
    // });

}

function downloadFile(req, res) {

    var userId = req.userId
    var fileName = req.body.fileName
  
    // res.download(directoryPath + '\\upload.js', 'server.js', (err) => {
    //   if (err) {
    //     res.status(500).send({
    //       message: "Could not download the file. " + err,
    //     });
    //   }
    // })

    var params = {
      Key: "user/" + userId + "/" + fileName,
      Bucket: 'lysyncbucket'
    }
    s3.getObject(params, function(err, data) {
        if (err) {
            res.send('Download error')
        }
        fs.writeFileSync('./static/fayaz.jpg', data.Body)
        console.log(__dirname);
        console.log('file downloaded successfully')
        res.download('./static/fayaz.jpg','fayaz.jpg')
    })
}


module.exports.uploadFile = uploadFile
module.exports.downloadFile = downloadFile
