"use strict";

const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());

// Routes (for what? i dont know)
//location
//-----
function Location(city, geoDataResults) {
  this.search_query = city;
  this.formatted_query = geoDataResults.formatted_address;
  this.latitude = geoDataResults.geometry.location.lat;
  this.longitude = geoDataResults.geometry.location.lng;
}

app.get("/location", (request, response) => {
  let city = request.query.data;
  let locationObj = searchLatToLong(city);
  response.send(locationObj);
  console.log(locationObj);
});

function searchLatToLong(city) {
  const geoData = require("./data/geo.json");
  const geoDataResults = geoData.results[0];
  const locationObj = new Location(city, geoDataResults);
  return locationObj;
}

//--------weather
const weatherDataArray = [];
function Weather(weather, weatherDataResults) {
  this.search_query = weather;
  this.time = weatherDataResults.daily.data.time;
  this.forecast = weatherDataResults.daily.data.summary;
}

app.get("/weather", (request, response) => {
  let weather = request.query.data;
  let weatherObj = searchWeather(weather);
  response.send(weatherObj);
  console.log(weatherObj);
});

function searchWeather(weather) {
  const weatherData = require("./data/darksy.json");
  const weatherDataResults = weatherData.daily.data[i];
  const weatherObj = new Weather(weather, weatherDataResults);
  for (let i = 0; i < weatherData.daily.data.length; i++) {
    weatherDataArray.push(weatherObj);
  }
  return weatherDataArray;
}

app.get("*", (request, response) => {
  response.status(404).send("Page not found");
});

app.listen(PORT, () => console.log(`listening on port ${PORT}!`));
