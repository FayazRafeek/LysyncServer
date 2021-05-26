

var firestore = require('../Firebase/firestore')
var fcm = require('../Firebase/fcm')
const notifyDataAdd = async (uId,data) => {

    
    var devices = await  firestore.getDevices(uId);
    
    var fcmTokens = new Array();

    if(!devices.empty){

        await devices.forEach(doc =>  {
            var type = doc.data().deviceType;
            if(type.toString().trim() === 'Android'){ 
                fcmTokens.push(doc.data().fcmToken)
            }
        })


        console.log(fcmTokens.length);


        return await fcm.notifyDataAdd(fcmTokens,data)
      
        // console.log(r);
        // .then(r => {
        //     return r;
        // })
        // .catch(e => {
        //     return e;
        // })

    } else {
        return;
    }

}

module.exports.notifyDataAdd = notifyDataAdd;