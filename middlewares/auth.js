var admin = require('firebase-admin');
var serviceAccount = require('../config/firebase-service-account.json');
const util = require('../util');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://cs315-project.firebaseio.com'
});

module.exports.usersOnly = (req, res, next) => {
    let token = req.headers['Authorization'] || req.headers['authorization'];
    if (!token) {
        console.log('Empty auth header');
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

// usersOnly has to be called before this can be called
module.exports.facultyOnly = (req, res, next) => {
    util.isFaculty(req.user.uid, "uid").then(ans => {
        if (ans === true)
            next();
        else
            res.status(401).json({message: 'You are not authorized to perform this action'});
    })
};

// usersOnly has to be called before this can be called
module.exports.studentOnly = (req, res, next) => {
    console.log('checking', req.user.uid);
    util.isFaculty(req.user.uid, "uid").then(ans => {
        if (ans === false)
            next();
        else
            res.status(401).json({message: 'You are not authorized to perform this action'});
    })
};

module.exports.adminOnly = (req, res, next) => {
    let token = req.headers['Authorization'];
    if (!token) {
        res.sendStatus(401);
    } else {
        admin.auth().verifyIdToken(token)
            .then(function (decodedToken) {
                if (decodedToken.uid === "PVOAuYruV2UsE6pc9ZWNEoVsW9f1") {
                    req.user = decodedToken;
                    next();
                } else {
                    res.status(401).json({message: 'You are unauthorized to perform this action'});                    
                }
            }).catch(function (error) {
                res.sendStatus(401);
                console.log('error while decoding the token', error);
            });
    }
};
