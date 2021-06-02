var admin = require('./fire-admin');
var firestore = require('./firestore')


const notifyDataAdd = async (fcmTokens,payload) => {

    const message = {
        data: payload,
        tokens: fcmTokens
    };
    
    admin.messaging().sendMulticast(message)
    .then((response) => {
        return {status : true, successCount : response.successCount};
    })
    .catch((error) => {
        return {status : true, successCount : 0};
    });
    
}

module.exports.notifyDataAdd = notifyDataAdd;


