const pool = require('./config/dbConfig');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};
app.use(allowCrossDomain);

app.use(bodyparser.json());

app.listen(2113, () => console.log('Express server is running at the port : 2113'));

// GET the data
app.get('/data', (req, res) => {
    var postBody = req.body;
    console.log(postBody);
    var query = 'SELECT * FROM data';
    var queryParams = [];
    pool.getConnection((error, connection) => {
        if (connection) {
            connection.query(query, queryParams, (err, rows, fields) => {
                connection.release();
                if (rows) {
                    res.json({
                        "status": true,
                        "data": rows
                    });
                } else {
                    err && console.log(err);
                    res.json({
                        "status": false,
                        "data": []
                    });
                }
            });
        }
    });
});

// GET the data by ID
app.get('/data/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM data WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(rows)
        }
        else {
            console.log(err);
        }
    })
});

//DELETE data
app.delete('/data/delete/:id', (req, res) => {
    let qry = "DELETE FROM data WHERE id = ?";
    let queryParams = [req.params.id];
    pool.getConnection((error, connection) => {
        if (connection) {
            connection.query(qry, queryParams, (err, rows) => {
                connection.release();
                if (rows) {
                    console.log(rows);
                    res.status(200).json({
                        "status": true,
                        "data": rows
                    });

                } else {
                    err && console.log(err);
                    res.json({
                        "status": false,
                        "data": []
                    });
                }
            });
        }
    });
});

//INSERT data
app.post('/data/insert', (req, res) => {
    let getData = req.body;
    console.log(getData);
    let qry = "INSERT INTO data (subject, priority, status, user, assigned_user) VALUES (?, ?, ?, ?, ? )";
    let queryParams = [req.body.subject, req.body.priority, req.body.status, req.body.user, req.body.assigned_user];
    pool.getConnection((error, connection) => {
        if (connection) {
            connection.query(qry, queryParams, (err, rows) => {
                connection.release();
                if (rows) {
                    console.log(rows);
                    res.status(200).json({
                        "status": true,
                        "data": rows
                    });

                } else {
                    err && console.log(err);
                    res.json({
                        "status": false,
                        "data": []
                    });
                }
            });
        }
    });
});

//UPDATE data
app.put('/data/update/:id', (req, res) => {
    let getData = req.body;
    console.log(getData);

    let qry = "UPDATE data SET priority = ?, subject = ?, status = ?, user = ?, assigned_user = ? where id = ? ";
    let queryParams = [getData.priority, getData.subject, getData.status, getData.user, getData.assigned_user, getData.id];
    pool.getConnection((error, connection) => {
        if (connection) {
            connection.query(qry, queryParams, (err, rows) => {
                connection.release();
                if (rows) {
                    console.log(rows);
                    res.status(200).json({
                        "status": true,
                        "data": rows
                    });

                } else {
                    err && console.log(err);
                    res.json({
                        "status": false,
                        "data": []
                    });
                }
            });
        }
    });
});

app.post('/data', (req, res) => {
    console.log(req.body.priority);
    let priorityValue = req.body.priority ? req.body.priority : null;
    let statusValue = req.body.status ? req.body.status : null;

    let qry = "select * from data ";
    var finalQry = null;
    var queryParams = [];
    if (priorityValue && statusValue === null) {
        finalQry = qry + "where priority = ?";
        queryParams = [priorityValue];
    }
    if (statusValue && priorityValue === null) {
        finalQry = qry + "where status = ?"
        queryParams = [statusValue];
    }
    if (priorityValue && statusValue) {
        finalQry = qry + "where priority = ? and status = ?"
        queryParams = [priorityValue, statusValue];
    }
    console.log(finalQry);

    pool.getConnection((error, connection) => {
        if (connection) {
            connection.query(finalQry, queryParams, (err, rows) => {
                connection.release();
                if (rows) {
                    console.log(rows);
                    res.status(200).json({
                        "status": true,
                        "data": rows
                    });

                } else {
                    err && console.log(err);
                    res.json({
                        "status": false,
                        "data": []
                    });
                }
            });
        }
    });
});