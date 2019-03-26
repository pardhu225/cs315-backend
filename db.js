var mysql = require('promise-mysql');
var connection;

console.log('Trying to connect to database');

mysql.createConnection({
    host: "13.234.67.30",
    user: "root",
    password: "gloriaborger",
    database: "cs315"
}).then(conn => {
    console.log("Connected to database!");
    connection = conn;
}).catch(e => {
    console.error('Faled to connect to database');
    throw e;
});

module.exports.conn = () => connection;