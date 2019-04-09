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