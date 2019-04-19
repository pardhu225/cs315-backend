// const winston = require('winston');
var admin = require('firebase-admin');
var db = require('../db');

updateStudentProps = [
    {
        prop: 'name',
        validator: (val) => true
    },
    {
        prop: 'address',
        validator: (val) => true
    },
    {
        prop: 'marital_status',
        validator: (val) => true
    },
    {
        prop: 'date_of_birth',
        validator: (val) => true
    },
    {
        prop: 'mobile_1',
        validator: (val) => true
    },
    {
        prop: 'mobile_2',
        validator: (val) => true
    },
    {
        prop: 'alternate_email',
        validator: (val) => true
    },
    {
        prop: 'hostel',
        validator: (val) => true
    },
    {
        prop: 'room',
        validator: (val) => true
    },
    {
        prop: 'father_name',
        validator: (val) => true
    },
    {
        prop: 'mother_name',
        validator: (val) => true
    },
    {
        prop: 'father_mobile_1',
        validator: (val) => true
    },
    {
        prop: 'mother_mobile_1',
        validator: (val) => true
    },
    {
        prop: 'father_mobile_2',
        validator: (val) => true
    },
    {
        prop: 'mother_mobile_2',
        validator: (val) => true
    },
    {
        prop: 'father_email',
        validator: (val) => true
    },
    {
        prop: 'mother_email',
        validator: (val) => true
    },
];
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
        .then(function (r) {
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
                        console.log(results);
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

/**
 * This function for registering a faculty on the site.
 * First create the user on the firebase, then create on our database, then send the
 * verification email
 */
exports.updateStudent = (req, res) => {
    let valid = true;
    updateStudentProps.forEach(e => {
        if (!e.validator(req.body[e.prop])) {
            console.log(req.body[e.prop], e.validator(req.body[e.prop]), e.prop);
            valid = false;
        }
    });
    if (!valid) {
        res.status(401).json({ message: 'Malformed request data' });
        return;
    }
    let d = new Date(req.body.date_of_birth);

    db.conn().query(
        `UPDATE student SET 
            name = '${req.body.name}',
            address = '${req.body.address}',
            marital_status = '${req.body.marital_status}',
            date_of_birth = '${d.getFullYear()}-${d.getMonth() + 1}-${d.getDay() + 1}',
            mobile_1 = '${req.body.mobile_1}',
            mobile_2 = '${req.body.mobile_2}',
            alternate_email = '${req.body.alternate_email}',
            hostel = '${req.body.hostel}',
            room = '${req.body.room}',
            father_name = '${req.body.father_name}',
            mother_name = '${req.body.mother_name}',
            father_mobile_1 = '${req.body.father_mobile_1}',
            mother_mobile_1 = '${req.body.mother_mobile_1}',
            father_mobile_2 = '${req.body.father_mobile_2}',
            mother_mobile_2 = '${req.body.mother_mobile_2}',
            father_email = '${req.body.father_email}',
            mother_email = '${req.body.mother_email}',
            Income = ${req.body.Income}
            WHERE uid="${req.user.uid}"`
    )
    .then(r => {
        res.status(200).json({ message: 'Student updated successfully' });
    })
    .catch(function (error) {
        console.log("\tError updating student:", error);
        res.status(400).json({ message: error.message });
    });
};


/**
 * This function returns personal details of students
 */
exports.personalDetails = (req, res) => {
    var sql = 
            `
            SELECT address,email,gender,CPI,name ,department,batch,programme
            FROM student 
            WHERE uid = "${req.user.uid}"`
    ;
    db.conn().query(sql)
      .then(r => res.status(200).json(r))
      .catch(e => {
          res.status(500).json({message: 'Unable to push the complaint'});
          console.log(e);
      });
};
