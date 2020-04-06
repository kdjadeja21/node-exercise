const mysql = require('mysql');

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'supportticketdb',
    timezone: 'utc'
});

module.exports = pool;