

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

        var title = payload.title
        var desc = payload.desc
        var type = payload.type

        console.log("\n\nPayload => " + title + " == " + desc + " == " + type)

        return await fcm.notifyDataAdd(fcmTokens,title,desc,type)

    } else {
        return {status : false, errorCode : 109};
    }

}

module.exports.notifyDataAdd = notifyDataAdd;