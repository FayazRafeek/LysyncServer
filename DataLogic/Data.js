
var firestore = require('../Firebase/firestore');
var notify = require('./notify')

const addData = (uId,data) =>  {

    return new Promise((resolve,reject) => {

        console.log("DATA ADDED");
        firestore.addData(uId,data)
        .then((result) => {
            console.log("Add data result " + result);
            resolve({status : true})
            return
        })
        .catch(e => {
            reject(e)
            return {status: false, message : 'Failed to add data'}
        })

    })
}

const notifiUsers = (uId,data) => {

    return new Promise((resolve,reject) => {
        notify.notifyDataAdd(uId,data)
        .then( result2 => {
            console.log(result2);
            resolve({status : true})
            return
        })
        .catch(error => {
            resolve({status : false,message : 'Failed'})
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