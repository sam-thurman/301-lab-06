'use strict';

function Weather(weatherData) {
  this.time = new Date(weatherData.time * 1000).toDateString();
  this.forecast = weatherData.summary;
}

module.exports = Weather;