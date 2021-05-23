var admin = require('./fire-admin');
var firestore = require('./firestore')

function sendNotification(req,res){

    const registrationToken = 'cKnlkcjAQWqr1DkZ9hnwQv:APA91bHOEGiJrlc95FffCUAEaP5_t1liTV4MlN7fZABvMPDou3SR05yn0QP936FkLy8KxTby3rlYeHQTCShH-QkcOZKvjWL3WkSMUxNkMPjQ5cPue0NTZ0tQwDAjgh1LZwTP4VsTQ_nk';

    const message = {
    data: {
        score: '850',
        time: '2:45'
    },
    token: registrationToken
    };

    admin.messaging().send(message)
    .then((response) => {
        res.send(response);
    })
    .catch((error) => {
        res.send('Error Sending notification');
    });
}

const notifyDataAdd = async (fcmTokens,data) => {

    console.log(fcmTokens);
    const message = {
        data: {
            data : data,
        },
        tokens: fcmTokens
    };
    
    admin.messaging().sendMulticast(message)
    .then((response) => {
        return response;
    })
    .catch((error) => {
        return error;
    });
    
    // const registrationToken = 'cKnlkcjAQWqr1DkZ9hnwQv:APA91bHOEGiJrlc95FffCUAEaP5_t1liTV4MlN7fZABvMPDou3SR05yn0QP936FkLy8KxTby3rlYeHQTCShH-QkcOZKvjWL3WkSMUxNkMPjQ5cPue0NTZ0tQwDAjgh1LZwTP4VsTQ_nk';

}

module.exports.sendNotification = sendNotification;
module.exports.notifyDataAdd = notifyDataAdd;


