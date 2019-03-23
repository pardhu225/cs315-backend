var admin = require('firebase-admin');
var serviceAccount = require('../firebase-service-account.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://techkriti-19.firebaseio.com'
});


module.exports = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        token = req.headers['Authorization'];
    }
    if (!token) {
        res.sendStatus(401);
    } else {
        admin.auth().verifyIdToken(token)
            .then(function (decodedToken) {
                req.user = decodedToken;
                next();
            }).catch(function (error) {
                res.sendStatus(401);
                console.log('error while decoding the token', error);
            });
    }
};
