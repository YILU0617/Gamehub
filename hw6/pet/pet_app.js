
const mysql = require('mysql2');
const express = require('express');
const path = require('path');

// the credential info
const config = require('./config.json');

// create and config the express application on localhost:3000
var app = express();
app.use(express.urlencoded({extended : false}));
app.use(express.json());
app.listen(3000);

// serve the form
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/select_pet_type.html'));
});






// handle the request and forward the response
app.post('/show_pets_by_type.html', function(request, response) {
    var type = request.body.PetTypeChoice;
    var cn = mysql.createConnection(config);
    cn.connect();
    const q = 'SELECT id, name, appearance FROM pet WHERE type = ?';
    cn.query(q, [type], function(err, rows, fields) {
        if (err) {console.log('Error: ', err);}
        var str = '<html>\n<body>\n';
        str += '<p>Pet Type: ' + type + '</p>\n';
        str += '<ol>\n';
        for (const r of rows) { // iterate through result set
            str += '<li>';
            str += r['id'] + ', ' + r['name'] + ', ' + r['appearance'];
            str += '</li>\n';
        }
        str += '</ol>\n';
        str += '</body>\n</html>\n';
        response.send(str); // dynamically generate the new html page
    });
    cn.end();
});
