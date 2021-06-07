var admin = require('./fire-admin');
var firestore = require('./firestore')


const notifyDataAdd = async (fcmTokens,title,desc,type) => {

    const message = {
        data: {
            title : title,
            desc : desc,
            type : type
        },
        tokens: fcmTokens
    };
    
    admin.messaging().sendMulticast(message)
    .then((response) => {
        console.log("FCM RESPONSE => " + response);
        return {status : true, successCount : response.successCount};
    })
    .catch((error) => {
        console.log("FCM ERROR => " + error);
        return {status : true, successCount : 0};
    });
    
}

module.exports.notifyDataAdd = notifyDataAdd;


