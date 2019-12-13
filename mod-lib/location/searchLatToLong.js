'use strict';
//MODULES
const Location = require('./Location')
const superagent = require('superagent')
const client = require('../../client')

function searchLatToLong(request, response) {
  let sql = 'SELECT * FROM location WHERE city=$1;';
  let safeValues = [request];
  client.query(sql, safeValues)
    .then(results => {
      if (results.rowCount > 0) {
        response.send(results.rows[0])
      } else {

        let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request}&key=${process.env.GEOCODE_API_KEY}`;
        superagent.get(url).then(results => {
          const locationObj = new Location(request, results);


          let sql = 'INSERT INTO location(formatted_query, latitude, longitude, city) VALUES ($1, $2, $3, $4);';
          let safeValues = [
            locationObj.formatted_query,
            locationObj.latitude,
            locationObj.longitude,
            locationObj.search_query
          ];
          client.query(sql, safeValues)
          response.send(locationObj);
        })
      }
    });
}

module.exports = searchLatToLong;