var db = require('../db');

/**
 * This function is supposed to return the basic details of students (those details which needs to be shown on database)
 */
exports.getCourses = (req, res) => {
    var sql = `SELECT * FROM course;`;
    console.log(req.body.dept)
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
                      course_offering.offering_id,
                      student_course_registration.status
                FROM
                      course,
                      course_offering,
                      student_course_registration
                WHERE
                      course_offering.coursecode = course.code AND 
                      student_course_registration.uid = "${req.user.uid}" AND
                      course_offering.year = ${new Date().getFullYear()} AND
                      course_offering.half = "${new Date().getMonth() < 6? 'even' : 'odd'}" AND
                      student_course_registration.offering_id = course_offering.offering_id`;
    db.conn().query(sql)
      .then(r => res.status(200).json(r))
      .catch(e => {
          res.status(500).json({message: 'Unable to fetch the courses'});
          console.log(e);
      });
};
exports.thisSemFacCourses = (req, res) => {
    var sql = `SELECT course.code,
                      course.title,
                      course_offering.offering_id,
                      faculty_course_registration.taking_as
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
      .then(r => res.status(200).json(r))
      .catch(e => {
          res.status(500).json({message: 'Unable to fetch the courses'});
          console.log(e);
      });
};


/**
 * This function when student applies for a course
 */
exports.requestCourse = (req, res) => {
    var sql = `INSERT INTO
                    student_course_registration
                    (offering_id, course_nature, taken_as, status, uid, remark)
                VALUES
                    (${req.body.offering_id},'${req.body.course_nature}','${req.body.taken_as}','waiting','${req.user.uid}','${req.body.remark}')
    `;
    db.conn().query(sql)
      .then(r => res.status(200).json({message: 'Course successfully requested'}))
      .catch(e => {
          res.status(500).json({message: 'Unable to request the course the courses'});
          console.log(e);
      });
};
exports.dropCourse = (req, res) => {
    var sql = ` UPDATE
                    student_course_registration
                SET
                    status = "drop (requested)"
                WHERE
                    uid  = "${req.user.uid}" AND
                    offering_id = ${req.body.offering_id} AND
                    status = "accepted";
    `;
    db.conn().query(sql)
      .then(r => {
          res.status(200).json({message: 'Course successfully requested'});
          console.log(r)
        })
      .catch(e => {
          res.status(500).json({message: 'Unable to request the course the courses'});
          console.log(e);
      });
};
exports.withdrawCourse = (req, res) => {
    var sql = ` DELETE FROM
                    student_course_registration
                WHERE
                    uid = "${req.user.uid}" AND
                    offering_id = ${req.body.offering_id} AND
                    status = "waiting";
    `;
    db.conn().query(sql)
      .then(r => res.status(200).json({message: 'Course successfully requested'}))
      .catch(e => {
          res.status(500).json({message: 'Unable to request the course the courses'});
          console.log(e);
      });
};

/**
 * This function when faculty decides he will accept the student's request
 */
exports.acceptCourse = (req, res) => {
    var sql = ` UPDATE
                    student_course_registration
                SET
                    status = "accepted"
                WHERE
                    uid  = "${req.body.studentUid}" AND
                    offering_id = ${req.body.offering_id};
    `;
    db.conn().query(sql)
      .then(r => res.status(200).json({message: 'Request accepted'}))
      .catch(e => {
          res.status(500).json({message: 'Unable to request the course the courses'});
          console.log(e);
      });
};
exports.rejectCourse = (req, res) => {
    var sql = ` UPDATE
                    student_course_registration
                SET
                    status = "rejected"
                WHERE
                    uid  = "${req.body.student_uid}" AND
                    offering_id = ${req.body.offering_id};
    `;
    db.conn().query(sql)
      .then(r => res.status(200).json({message: 'Request rejected!'}))
      .catch(e => {
          res.status(500).json({message: 'Unable to request the course the courses'});
          console.log(e);
      });
};
exports.letsMeetCourse = (req, res) => {
    var sql = ` UPDATE
                    student_course_registration
                SET
                    status = "ask to meet"
                WHERE
                    uid  = "${req.user.uid}" AND
                    offering_id = ${req.body.offering_id};
    `;
    db.conn().query(sql)
      .then(r => res.status(200).json({message: 'Asked to meet!'}))
      .catch(e => {
          res.status(500).json({message: 'Unable to request the course the courses'});
          console.log(e);
      });
};

/**
 * This function when faculty decides student will drop the course
 */
exports.acceptDropCourse = (req, res) => {
    var sql = ` UPDATE
                    student_course_registration
                SET
                    status = "drop (accepted)"
                WHERE
                    uid  = "${req.body.uid}" AND
                    offering_id = ${req.body.offering_id} AND
                    status = "drop (requested)";
    `;
    db.conn().query(sql)
      .then(r => res.status(200).json({message: 'Drop accepted'}))
      .catch(e => {
          res.status(500).json({message: 'Unable to process query'});
          console.log(e);
      });
};
exports.rejectDropCourse = (req, res) => {
    var sql = ` UPDATE
                    student_course_registration
                SET
                    status = "drop (rejected)"
                WHERE
                    uid  = "${req.body.uid}" AND
                    offering_id = ${req.body.offering_id} AND
                    status = "drop (requested)";
    `;
    db.conn().query(sql)
      .then(r => res.status(200).json({message: 'Drop rejected'}))
      .catch(e => {
          res.status(500).json({message: 'Unable to process query'});
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
                SET status='drop (requested)'
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
 * Students of a course offering
 */
exports.myStudents = (req, res) => {
    var sql = ` SELECT
                    student.name,
                    student.roll_no,
                    student.CPI
                FROM
                    student,
                    course_offering,
                    student_course_registration,
                    faculty_course_registration,
                    faculty
                WHERE
                    course_offering.offering_id = student_course_registration.offering_id AND
                    course_offering.offering_id = faculty_course_registration.offering_id AND
                    student.uid = student_course_registration.uid AND
                    faculty.uid = ${req.user.uid} AND
                    course_offering.year = ${new Date().getFullYear()} AND
                    course_offering.half = '${new Date().getMonth() < 6 ? 'even' : 'odd'}'
    `;
    db.conn().query(sql)
      .then(r => res.status(200).json(r))
      .catch(e => {
          res.status(500).json({message: 'Unable to process query'});
          console.log(e);
      });

};

/**
 * All the courses offered during the current semseter
 */
exports.thisSemAllCourses = (req, res) => {
    var sql =   `SELECT
                    offering_id,
                    offered_as,
                    coursecode,
                    title,
                    lecture_credits,
                    tutorial_credits,
                    year, half
                FROM
                    course_offering,
                    course
                WHERE
                    course_offering.coursecode = course.code AND
                    year = ${new Date().getFullYear()} AND half = '${new Date().getMonth() < 6 ? 'even' : 'odd'}';`;

    db.conn().query(sql)
    .then(r => res.status(200).json(r))
    .catch(e => {
        res.status(500).json({message: 'Unable to process query'});
        console.log(e);
    });
};

/**
 * This function rejects a course to register for students
 */
exports.rejectedCourses = (req, res) => {
    var sql = `
                UPDATE student_course_registration 
                SET status='rejected'
                WHERE uid="${req.body.uid}" AND offering_id="${req.body.offering_id}"
    `;
    db.conn().query(sql)
    .then(r => {
        res.status(200).json("course rejected")
        console.log(r);
    })
      .catch(e => {
          res.status(500).json({message: 'Unable to fetch the courses'});
          console.log(e);
      });
};

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

/**
 * This function rejects a course to register for students
 */
exports.meetCourses = (req, res) => {
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
 * For faculty to create new offering
 * @route /api/faculty/create-offering
 */
exports.createOffering = (req, res) => {
    if (!(req.body.coursecode && req.body.offering_as)) {
        res.status(401).json({message: 'Malformed data'});
        return;
    }
    var sql =  `INSERT INTO
                    course_offering (coursecode, half, offered_as, year, remarks)
                VALUES
                    ("${req.body.coursecode}", "${new Date().getMonth()<6?'even': 'odd'}", "${req.body.offering_as}", ${new Date().getFullYear()}, "${req.body.remarks}")`;

    db.conn().query(sql)
    .then(r => { 
        var sql =  `INSERT INTO
                        faculty_course_registration (offering_id, taking_as, uid)
                    VALUES
                        (${r.insertId}, 'Instructor Incharge', "${req.user.uid}")`;
        return db.conn().query(sql);
    })
    .then(r => {
        res.status(200).json(r);
        console.log(r);
    })
    .catch(e => {
        res.status(500).json({message: 'Unable to process query'});
        console.log(e);
    });
};

/**
 * For faculty to register as tutor to an offering
 * @route /api/faculty/register-as-tutor
 */
exports.registerAsTutor = (req, res) => {
    if (!req.body.offering_id) {
        res.status(401).json({message: 'Malformed data'});
        return;
    }
    var sql =  `INSERT INTO
                    faculty_course_registration (uid , offering_id , taking_as)
                VALUES
                    ("${req.user.uid}", "${req.body.offering_id}", "tutor")`;

    db.conn().query(sql)
    .then(r => res.status(200).json(r))
    .catch(e => {
        res.status(500).json({message: 'Unable to process query'});
        console.log(e);
    });
};


/*
 * This function adds a course to register for students
 */
exports.acceptCourses = (req, res) => {
    var sql = `
                UPDATE student_course_registration 
                SET status='Accepted'
                WHERE uid="${req.body.uid}" AND offering_id="${req.body.offering_id}"
    `;
    db.conn().query(sql)
      .then(r => {
          res.status(200).json("course accepted");
          console.log(r);
        })
      .catch(e => {
          res.status(500).json({message: 'Unable to fetch the courses'});
          console.log(e);
      });
};

exports.currentStudents = (req, res) => {
    var sql = `
            SELECT
                student.name, student.roll_no, student.CPI, student.department, course_offering.offering_id, student_course_registration.status
            FROM
                student, course_offering, student_course_registration,
                faculty_course_registration, faculty
            WHERE
                course_offering.offering_id = student_course_registration.offering_id AND
                course_offering.offering_id = faculty_course_registration.offering_id AND
                student.uid = student_course_registration.uid AND
                faculty.uid = faculty_course_registration.uid AND
                course_offering.year = ${new Date().getFullYear()} AND
                course_offering.half = '${new Date().getDate() < 6 ? 'even' : 'odd'}' AND
                faculty.uid = "${req.user.uid}"`;
    db.conn().query(sql)
        .then(r => res.status(200).json(r))
        .catch(e => {
            res.status(500).json({message: 'Unable to fetch the courses'});
            console.log(e);
        });
};

exports.studentsOfCourse = (req, res) => {
    var sql = `
            SELECT
                student.name, student.roll_no, student.CPI, student.department, student.uid, course_offering.offering_id, student_course_registration.status
            FROM
                student, course_offering, student_course_registration,
                faculty_course_registration, faculty
            WHERE
                course_offering.offering_id = student_course_registration.offering_id AND
                course_offering.offering_id = faculty_course_registration.offering_id AND
                student.uid = student_course_registration.uid AND
                faculty.uid = faculty_course_registration.uid AND
                course_offering.offering_id = ${req.body.offering_id}`;
    db.conn().query(sql)
        .then(r => res.status(200).json(r))
        .catch(e => {
            res.status(500).json({message: 'Unable to fetch the courses'});
            console.log(e);
        });

};