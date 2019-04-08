// const winston = require('winston');
var admin = require('firebase-admin');
var db = require('../db');

/**
 * This function for registering a student on the site.
 * First create the user on the firebase, then create on our database, then send the
 * verification email
 */
exports.registerStudent = (req, res) => {
    if (typeof req.body.username !== 'string' || req.body.username.length > 8 || typeof req.body.password !== 'string' || req.body.password.length < 8) {
        res.status(400).json({ message: 'Malformed username or password' });
        return;
    }

    db.conn().query(`SELECT * FROM student WHERE email="${req.body.username}@iitk.ac.in"`)
        .then(function(r) {
            if (r.length === 0) {
                res.status(401).json({ message: 'User does not exist. Have you registered yourself first?' });
                return;
            }
            // Create user on firebase
            admin.auth().createUser({
                email: req.body.username + "@iitk.ac.in",
                password: req.body.password
            }).then(function (user) {
                console.log("\tSuccessfully created new user:", user.uid);
                var promises = [
                    db.conn().query(`INSERT INTO users VALUES ("${req.body.username}", "${user.uid}", "student")`),
                    db.conn().query(`UPDATE \`student\` SET uid="${user.uid}" WHERE email="${req.body.username}@iitk.ac.in";`)
                ];

                Promise.all(promises).then(results => {
                    res.status(200).json({ message: 'User successfully created' });
                }).catch(e => {
                    console.error(e);
                    res.status(500).json({ message: 'database error', json: JSON.stringify(e) });
                    throw e;
                });
            })
                .catch(function (error) {
                    console.log("\tError creating new user:", error);
                    res.status(400).json({
                        message: error.message
                    });
                });
        });
};

/**
 * This function for registering a faculty on the site.
 * First create the user on the firebase, then create on our database, then send the
 * verification email
 */
exports.registerFaculty = (req, res) => {
    if (typeof req.body.username !== 'string' || req.body.username.length > 8 || typeof req.body.password !== 'string' || req.body.password.length < 8) {
        res.status(400).json({ message: 'Malformed username or password' });
        return;
    }

    db.conn().query(`SELECT * FROM faculty WHERE email="${req.body.username}@iitk.ac.in"`)
        .then(r => {
            if (r.length === 0) {
                res.status(401).json({ message: 'User does not exist. Have you registered yourself first?' });
                return;
            }
            // Create user on firebase
            admin.auth().createUser({
                email: req.body.username + "@iitk.ac.in",
                password: req.body.password
            }).then(function (user) {
                console.log("\tSuccessfully created new user:", user.uid);
                var promises = [
                    db.conn().query(`INSERT INTO users VALUES ("${req.body.username}", "${user.uid}", "faculty")`),
                    db.conn().query(`UPDATE faculty SET uid="${user.uid}" WHERE email="${req.body.username}@iitk.ac.in";`)
                ];

                Promise.all(promises).then(results => {
                    res.status(200).json({ message: 'User successfully created' });
                }).catch(e => {
                    console.error(e);
                    res.status(500).json({ message: 'database error', json: JSON.stringify(e) });
                    throw e;
                });
            })
                .catch(function (error) {
                    console.log("\tError creating new user:", error);
                    res.status(400).json({
                        message: error.message
                    });
                });
        });
};

/**
 * This function is supposed to return the basic details of students (those details which needs to be shown on database)
 */
exports.getUserDetails = (req, res) => {
    db.conn().query(`SELECT * FROM users WHERE uid="${req.user.uid}"`)
        .then(r => {
            if (r.length === 0) {
                res.status(401).json({ message: 'Who r u?' });
                return;
            }
            if (r[0].usertype === 'student') {
                var promises = [
                    db.conn().query(`SELECT * FROM student_course_registration, course_offering, course
                                 WHERE student_course_registration.uid="${req.user.uid}"
                                 AND course_offering.offering_id = student_course_registration.offering_id
                                 AND year = ${new Date().getFullYear()}
                                 AND half = "${new Date().getMonth() < 5 ? 'even' : 'odd'}"
                                 AND course.code = course_offering.coursecode;`),
                    db.conn().query(`SELECT * FROM student WHERE uid="${req.user.uid}";`)
                ];

                Promise.all(promises)
                    .then((results) => {
                        res.status(200).json({
                            courses: results[0],
                            userDetails: results[1][0],
                            usertype: 'student'
                        });
                    }).catch(err => {
                        console.error(err);
                        res.status(500).json({ message: 'database error', json: JSON.stringify(err) });
                        throw err;
                    });
            }
            if (r[0].usertype === 'faculty') {
                var promises = [
                    db.conn().query(`SELECT * FROM faculty_course_registration, course_offering, course
                                 WHERE faculty_course_registration.uid="${req.user.uid}"
                                 AND course_offering.offering_id = faculty_course_registration.offering_id
                                 AND year = ${new Date().getFullYear()}
                                 AND half = "${new Date().getMonth() < 5 ? 'even' : 'odd'}"
                                 AND course.code = course_offering.coursecode;`),
                    db.conn().query(`SELECT * FROM faculty WHERE uid="${req.user.uid}";`)
                ];

                Promise.all(promises)
                    .then((results) => {
                        res.status(200).json({
                            courses: results[0],
                            userDetails: results[1][0],
                            usertype: 'faculty'
                        });
                    }).catch(err => {
                        console.error(err);
                        res.status(500).json({ message: 'database error', json: JSON.stringify(err) });
                        throw err;
                    });
            }
        });
};