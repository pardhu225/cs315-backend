const db = require('./db');

var studentCache = [];
var facultyCache = [];

module.exports.isFaculty = (facname, what) => {
    if (!what) throw new Error('what missing');

    if (!facname)
        return Promise.resolve(false);
    
    if (facultyCache.includes(facname))
        return Promise.resolve(true);

    if (studentCache.includes(facname))
        return Promise.resolve(false);
    
    return new Promise((resolve, reject) => {
        var sql;
        if (what !== 'uid')
            sql = `SELECT * FROM users WHERE email LIKE "${facname}@%"`;
        else
            sql = `SELECT * FROM users WHERE uid = "${facname}"`;
        db.conn().query(sql).then((result) => {
            if (result.length !== 0) {
                if (result[0].usertype === "faculty") {
                    facultyCache.push(result[0].username);
                    facultyCache.push(result[0].uid);
                    resolve(true);
                } else {
                    studentCache.push(result[0].username);
                    studentCache.push(result[0].uid);
                    resolve(false);
                }
            } else {
                resolve(undefined);
            }
        }).catch(e => {
            console.error(e);
            throw e;
        });
    });
};