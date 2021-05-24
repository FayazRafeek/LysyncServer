var admin = require('./fire-admin')

const db = admin.firestore();

var config = require('../Auth/config')
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// AUTH SECTION
const addUser = async (name1,email1,pass1) => {

    const data = {
        name: name1,
        email: email1,
        pass: pass1,
      };

    const i = await db.collection('Users').add(data)
    return  i.id
}

const updateToken = async (Uid,token) => {
    return await Promise.resolve(db.collection('Users').doc(Uid).update({token: token}));
}

const getUser = async (Uid) => {

    const res = await  db.collection('Users').doc(Uid).get();
    return  res;
  
}

const getUserWithEmail = async (email) => {

    const res = await  db.collection('Users').where('email', '==', email).limit(1).get();

    if(res.empty || res.docs.length < 1){
        return {status : false, user : '', message : 'No User Available'}
    }

    var doc = res.docs[0]
    return {status : true, user : doc}
}

module.exports.addUser = addUser;
module.exports.updateToken = updateToken;
module.exports.getUser = getUser;
module.exports.getUserWithEmail = getUserWithEmail;

// AUTH ENDS

//Device Logic 

const addDevice = async (uId,device) => {
    return await db.collection('Users').doc(uId).collection('Devices').doc(device.deviceId).set(device)
}

const removeDevice = async (uId,deviceId) => {
    return await db.collection('Users').doc(uId).collection('Devices').doc(deviceId).delete()
}

const getDevices = async (uId) => {
    return await db.collection('Users').doc(uId).collection('Devices').get()
}

module.exports.addDevice = addDevice;
module.exports.getDevices = getDevices;
module.exports.removeDevice = removeDevice;

// DATA LOGIC


const addData = async (uId,data) => {
    return await db.collection('Users').doc(uId).collection('Datas').add({data : data, modified : new Date()})
}

const getAllDatas = async (uId) => {

    var r = await db.collection('Users').doc(uId).collection('Datas').get();

    var output = [];

    if(!r.empty){

        r.forEach(doc => {
            var value = doc.data().data
            var modified =  doc.data().modified
            output.push({value : value, modified : modified})
        })

        return {status : 'SUCCESS', output :  JSON.stringify(output)}
    } else {
        return {status : 'FAILED', output : ''}
    }                           

}

module.exports.addData = addData;
module.exports.getAllDatas = getAllDatas;