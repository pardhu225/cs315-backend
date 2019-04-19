var db = require('../db');

/**
 * This function is supposed to return the basic details of students (those details which needs to be shown on database)
 */
exports.getCourses = (req, res) => {
    var sql = `SELECT * FROM course;`;
    if (req.body.dept) {
        sql = `SELECT * FROM course WHERE department="${req.body.dept}";`;
    }
    db.conn().query(sql)
        .then(r => res.status(200).json(r))
        .catch(e => res.status(500).json({message: 'Unable to fetch the courses'}));
};

/**
 * This function supposed to return this semesters courses of a particular user
 */
exports.thisSemCourses = (req, res) => {
    var sql = `SELECT course.code,
                      course.title,
                      course_offering.offering_id
                FROM
                      course,
                      course_offering,
                      student_course_registration
                WHERE
                      course_offering.coursecode = course.code AND 
                      student_course_registration.uid = "${req.user.uid}" AND
                      course_offering.year = 2019 AND
                      course_offering.half = "even" AND
                      student_course_registration.offering_id = course_offering.offering_id`;
    db.conn().query(sql)
      .then(r => res.status(200).json(r))
      .catch(e => {
          res.status(500).json({message: 'Unable to fetch the courses'});
          console.log(e);
      });
};

/**
 * This function adds a course to register for students
 */

exports.addCourses = (req, res) => {
    var sql = `
                UPDATE student_course_registration 
                SET status='Accepted'
                WHERE uid="${req.user.uid}" AND offering_id="${req.body.offering_id}"
    `;
    db.conn().query(sql)
      .then(r => res.status(200).json("course accepted"))
      .catch(e => {
          res.status(500).json({message: 'Unable to fetch the courses'});
          console.log(e);
      });
};

/**
 * This function drop a course to register for students
 */

exports.dropCourses = (req, res) => {
    var sql = `
                UPDATE student_course_registration 
                SET status='Dropped'
                WHERE uid="${req.user.uid}" AND offering_id="${req.body.offering_id}";
    `;
    db.conn().query(sql)
      .then(r => res.status(200).json("course dropped"))
      .catch(e => {
          res.status(500).json({message: 'Unable to fetch the courses'});
          console.log(e);
      });
};

/**
 * This function rejects a course to register for students
 */

exports.rejectedCourses = (req, res) => {
    var sql = `
                UPDATE student_course_registration 
                SET status='Rejected'
                WHERE uid="${req.user.uid}" AND offering_id="${req.body.offering_id}"
    `;
    db.conn().query(sql)
      .then(r => res.status(200).json("course rejected"))
      .catch(e => {
          res.status(500).json({message: 'Unable to fetch the courses'});
          console.log(e);
      });
};
/**
 * This function rejects a course to register for students
 */

exports.facultyCourses = (req, res) => {
var sql = `SELECT course.code,
                      course.title,
                      course_offering.offering_id,
                      faculty_course_registration.taking_as,
                FROM
                      course,
                      course_offering,
                      faculty_course_registration
                WHERE
                      course_offering.coursecode = course.code AND 
                      faculty_course_registration.uid = "${req.user.uid}" AND
                      course_offering.year = ${new Date().getFullYear()} AND
                      course_offering.half = "${new Date().getMonth() < 6? 'even' : 'odd'}" AND
                      faculty_course_registration.offering_id = course_offering.offering_id`;
                      
    db.conn().query(sql)
    .then(r => res.status(200).json("course rejected"))
    .catch(e => {
        res.status(500).json({message: 'Unable to fetch the courses'});
        console.log(e);
    });
};


/*
 * This function adds a course to register for students
 */

exports.addCourses = (req, res) => {
    var sql = `
                UPDATE student_course_registration 
                SET status='Accepted'
                WHERE uid="${req.user.uid}" AND offering_id="${req.body.offering_id}"
    `;
    db.conn().query(sql)
      .then(r => res.status(200).json("course accepted"))
      .catch(e => {
          res.status(500).json({message: 'Unable to fetch the courses'});
          console.log(e);
      });
};
