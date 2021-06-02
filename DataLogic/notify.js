

var firestore = require('../Firebase/firestore')
var fcm = require('../Firebase/fcm')
const notifyDataAdd = async (uId,payload) => {

    
    var devices = await  firestore.getDevices(uId);
    var fcmTokens = new Array();

    if(!devices.empty){

        await devices.forEach(doc =>  {
            var type = doc.data().deviceType;
            if(type.toString().trim() === 'Android'){ 
                fcmTokens.push(doc.data().fcmToken)
            }
        })

        return await fcm.notifyDataAdd(fcmTokens,payload)

    } else {
        return;
    }

}

module.exports.notifyDataAdd = notifyDataAdd;