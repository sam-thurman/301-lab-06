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
  let locationObj = searchLatToLong();
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

function Weather(weatherData) {
  this.time = weatherData.time;
  this.forecast = weatherData.summary;
}

app.get("/weather", (request, response) => {
  let weather = request.query.data;
  let weatherObj = searchWeather(weather);
  response.send(weatherObj);
  console.log(weatherDataArray);
});

function searchWeather() {
  const weatherData = require("./data/darksky.json");
  const weatherDataResults = weatherData.daily.data;
  const weatherDataArray = [];

  for (let i = 0; i < weatherDataResults.length; i++) {
    weatherDataArray.push(new Weather(weatherDataResults[i]));
  }
  return weatherDataArray;
}

app.get("*", (request, response) => {
  response.status(404).send("Page not found");
});

app.listen(PORT, () => console.log(`listening on port ${PORT}!`));
