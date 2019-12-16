// Sam T
'use strict';


const Weather = require('./Weather');
const superagent = require('superagent');

function searchWeather(request, response) {
  let url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;
  let weatherArray = [];

  superagent.get(url).then(results => {
    results.body.daily.data.map(day => {
      weatherArray.push(new Weather(day));
    });
    response.send(weatherArray);
  });
}

module.exports = searchWeather;