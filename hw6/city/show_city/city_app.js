
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
    response.sendFile(path.join(__dirname + '/show_city.html'));
});






// handle the request and forward the response
app.post('/show_cities', function(request, response) {
    var countryCode = request.body.CountryCodeChoice;
    var cn = mysql.createConnection(config);
    cn.connect();
    const q = 'SELECT city_name, province_name, population FROM city WHERE country_code = ?';
    cn.query(q, [countryCode], function(err, rows, fields) {
        if (err) {console.log('Error: ', err);}
        var str = '<html>\n<body>\n';
        str += '<p>Country Code: ' + countryCode + '</p>\n';
        str += '<ol>\n';
        for (const r of rows) {
            str += '<li>';
            str += r['city_name'] + ', ' + r['province_name'] + ', Population: ' + r['population'];
            str += '</li>\n';
        }
        str += '</ol>\n';
        str += '</body>\n</html>\n';
        response.send(str);
    });
    cn.end();
});