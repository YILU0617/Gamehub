const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');


const config = require('./config.json');


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(3000);



const pool = mysql.createPool(config);

app.get('/', function(req, res) {
  pool.query('SELECT country_code, country_name FROM country ORDER BY country_name', (err, results) => {
    if (err) {
      console.error('Error fetching countries:', err);
      return res.sendStatus(500);
    }

    let countryOptionsHtml = results.map(country =>
      `<option value="${country.country_code}">${country.country_name}</option>`
    ).join('');

    res.send(`
    <html>
    <body>
    <b>Update country information:</b>
    <br/>
    <form action="/update" method="POST">
    <table>
    <tr>
    <td>Country:</td>
    <td>
    <select name="CountryCode">
    <option value="USA">United States of America</option>
    <option value="CAN">Canada</option>
    <option value="BRA">Brazil</option>
    <option value="ARG">Argentina</option>
    <option value="MEX">Mexico</option>
    <option value="FCT">FictionLand</option>
    <option value="ISL">Islandia</option>
    <option value="ABC">RichLand</option>
    <option value="CBA">PoorVille</option>
    </select>
    </td>
    </tr>
    <tr>
    <td>Country GDP:</td>
    <td><input type="text" name="gdp"></td>
    </tr>
    <tr>
    <td>Country Inflation:</td>
    <td><input type="text" name="inflation"></td>
    </tr>
    <tr><td><input type="submit" value="Update"/></td></tr>
    </table>
    </form>
    </body>
    </html>
    `);
  });
});

app.post('/update', function(req, res) {
  const { CountryCode, gdp, inflation } = req.body;
  pool.query(
    'UPDATE country SET gdp = ?, inflation = ? WHERE country_code = ?',
    [gdp, inflation, CountryCode],
    (err, results) => {
      if (err) {
        console.error('Error updating country:', err);
        return res.sendStatus(500);
      }

      pool.query('SELECT * FROM country', (err, results) => {
        if (err) {
          console.error('Error fetching updated countries:', err);
          return res.sendStatus(500);
        }

        let countriesHtml = results.map(country =>
          `<li>${country.country_code} - ${country.country_name}, GDP: ${country.gdp}, Inflation: ${country.inflation}</li>`
        ).join('');

        res.send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>Updated Country Information</title>
          </head>
          <body>
            <h1>Updated Country Information</h1>
            <ul>${countriesHtml}</ul>
          </body>
          </html>
        `);
      });
    }
  );
});

