
const { text } = require('express');
var firestore = require('../Firebase/firestore');
var notify = require('./notify')

const addData = (uId,body) =>  {

    console.log("Add Data body -> \n" + body);

    var isSmallData = body.isSmallData; 
    let payload, notificationPayload;

    if(isSmallData){
        var data = body.data
        var size = body.size

        payload = {
            isShortData : true,
            data : data,
            modified : new Date(),
            type : text,
            size : size,
            id : new Date().getMilliseconds()
        }

        notificationPayload = {
            title : "New Data added",
            desc : data,
            type : text
        }
    } else {

        var url = body.url
        var type = body.type
        var fileName = body.fileName
        var size = body.size

        payload = {
            isShortData : false,
            modified : new Date(),
            type : type,
            size : size,
            fileName : fileName,
            url : url,
            id : new Date().getMilliseconds()
        }

        notificationPayload = {
            title : "New File added",
            desc : fileName,
            type : type
        }
    }


    return new Promise((resolve,reject) => {
        firestore.addData(uId,payload)
        .then((result) => {
            resolve({status : true, notificationPayload : notificationPayload})
            return
        })
        .catch(e => {
            resolve({status: false, message : 'Failed to add data'})
            return 
        })

    })
}

const notifiUsers = (uId,payload) => {

    return new Promise((resolve,reject) => {
        notify.notifyDataAdd(uId,payload)
        .then( result2 => {
            resolve(result2)
            return
        })
        .catch(error => {
            resolve({status : false, message : 'Failed'})
            return
        })
    })

}


async function getAllData(uId) {

    await firestore.getAllDatas(uId)
    .then((result) => {
        return {status: true, output : result.output}
    })
    .catch(e => {
        return {status: false, message : 'Failed to add data'}
    })
}

module.exports.addData = addData
module.exports.getAllData = getAllData
module.exports.notifyUsers = notifiUsers