var db = require('../db');

/**
 * This function supposed to push complaint
 */
exports.complaintPush = (req, res) => {
    var sql = 
            `
                INSERT INTO complaints(uid,complaint,complaint_type,complaint_status,location, complaint_title)
                VALUES ("${req.user.uid}","${req.body.complaint}","${req.body.complaint_type}","pending","${req.body.location}", "${req.body.complaint_title}");
            `
    ;
    db.conn().query(sql)
      .then(r => res.status(200).json("complaint successful"))
      .catch(e => {
          res.status(500).json({message: 'Unable to push the complaint'});
          console.log(e);
      });
};
/**
 * complaint history
 */
exports.complaintHistory = (req, res) => {
    var sql =   `SELECT
                    *
                FROM
                    complaints
                WHERE
                    uid = "${req.user.uid}";`;
    db.conn().query(sql)
      .then(r => res.status(200).json(r))
      .catch(e => {
          res.status(500).json({message: 'Unable to push the complaint'});
          console.log(e);
      });
};
/**
 * This function after complaint is completed
 */
exports.complaintCompleted = (req, res) => {
    var sql = 
            `Update complaints
            SET complaint_status = "complete"
            WHERE complaint_id = "${req.body.complaint_id}"; 
            `
    ;
    db.conn().query(sql)
      .then(r => res.status(200).json("complaint removed"))
      .catch(e => {
          res.status(500).json({message: 'Unable to push the complaint'});
          console.log(e);
      });
};

/**
 * This function for hall dues
 */
exports.dues = (req, res) => {
    var sql =  `SELECT
                    hall_number,
                    mess_dues,
                    electricity_dues,
                    other_dues
                FROM
                    hall_admin 
                WHERE
                    uid = "${req.user.uid}"`;
    db.conn().query(sql)
      .then(r => res.status(200).json(r))
      .catch(e => {
          res.status(500).json({message: 'Unable to push the complaint'});
          console.log(e);
      });
};


/**
 * This function supposed to push complaint
 */
exports.leaveRequest = (req, res) => {
    var sql = 
            `
                INSERT INTO leave_application(uid,leave_duration,leave_start,leave_end,leave_status,reason)
                VALUES ("${req.user.uid}","${req.body.leave_duration}","${req.body.leave_start}","${req.body.leave_end}","pending","${req.body.reason}");
            `
    ;
    db.conn().query(sql)
      .then(r => res.status(200).json("leave application applied"))
      .catch(e => {
          res.status(500).json({message: 'Unable to push the application'});
          console.log(e);
      });
};

/**
 * This function supposed to push complaint
 */
exports.leaveAccepted = (req, res) => {
    var sql = 
            `
                Update leaveApplication
                SET leave_application = "Accpeted"
                WHERE complaint_id = "${req.body.leave_id}"; 
            `
    ;
    db.conn().query(sql)
      .then(r => res.status(200).json("leave application approved"))
      .catch(e => {
          res.status(500).json({message: 'Unable to push the complaint'});
          console.log(e);
      });
};
/**
 * This function supposed to push complaint
 */
exports.leaveDenied = (req, res) => {
    var sql = 
            `
                Update leaveApplication
                SET leave_application = "Denied"
                WHERE complaint_id = "${req.body.leave_id}"; 
            `
    ;
    db.conn().query(sql)
      .then(r => res.status(200).json("leave application denied"))
      .catch(e => {
          res.status(500).json({message: 'Unable to push the complaint'});
          console.log(e);
      });
};
