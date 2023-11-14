
// load mysql2
const mysql = require('mysql2');

// load credentials
const config = require('./config.json');

// create the connection
const cn = mysql.createConnection(config);

// basic query example
const q = 'SELECT * FROM pet ORDER BY name';

// open the connection
cn.connect(function(err) {
    if (err) throw err;
});

// run the query and log to output
cn.query(q, function(err, result, fields) {
    if (err) throw err;
    for (const r of result) {
        console.log(r['name'] + ' is a ' + r['type']);
    }
});

// close the connection
cn.end(function(err) {
    if (err) throw err;
});
