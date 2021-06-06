
const { text } = require('express');
var firestore = require('../Firebase/firestore');
var notify = require('./notify')

const addData = (uId,body) =>  {

    var isSmallData = body.isSmallData; 
    let payload, notificationPayload;

    var currTime = new Date().getTime().toString()
    if(isSmallData){
        var data = body.data
        var size = body.size

        payload = {
            isShortData : true,
            data : data,
            modified : currTime,
            type : "text",
            size : size,
            id : currTime
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
            modified : currTime,
            type : type,
            size : size,
            fileName : fileName,
            url : url,
            id : currTime
        }

        notificationPayload = {
            title : "New File added",
            desc : fileName,
            type : type
        }
    }

    console.log("Payload => " + JSON.stringify(payload));
    var id = payload.id
    console.log("Payload ID  => " + id);

    return new Promise((resolve,reject) => {
        firestore.addData(uId,payload)
        .then((result) => {
            resolve({status : true, notificationPayload : notificationPayload})
            return
        })
        .catch(e => {
            console.log("Add Error => " + e);
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


const getAllData = uId =>  {

    return new Promise((resolve,rejct) => {
        firestore.getAllDatas(uId)
        .then((result) => {

            var output = [];

            if(!result.empty){
                result.forEach(doc => {
                   output.push(doc.data())
                })
                resolve({status : true, output : output})
            } else {
                resolve( {status : false, message : 'No datas available', errorCode : 113})
            } 
        })
        .catch(e => {
            console.log(e);
            resolve( {status: false, message : 'Failed to get data', errorCode : 112})
        })

        return;
    })
   
}

module.exports.addData = addData
module.exports.getAllData = getAllData
module.exports.notifyUsers = notifiUsers