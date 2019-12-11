"use strict";
// getting express library
const express = require("express");
const app = express();

// getting our .env and our variables
require("dotenv").config();
const PORT = process.env.PORT || 3001;

// cors is the police person of the server, tells who is allowed to talk to us
const cors = require("cors");
app.use(cors());
//allows us to get real data

const superagent = require("superagent");
// Routes (for what? i dont know)

function APIerror() {
  return {
    status: 500,
    responseText: "Sorry, something went wrong"
  };
}

//location
//-----
function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}

app.get("/location", (request, response) => {
  try {
    let city = request.query.data;
    let locationObject = searchLatToLong(city);
    console.log(locationObject);
    response.send(locationObject);
  } catch (error) {
    console.error(error);
    response.status(500).send("Sorry, something went wrong");
  }
});

function searchLatToLong(city) {
  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${process.env.GEOCODE_API_KEY}`;

  superagent.get(url).then(results => {
    // console.log(results.body);
    const locationObj = new Location(city, results.body);
    console.log(
      `${locationObj.formatted_query} has a latitude of: ${locationObj.latitude} and a longitude of: ${locationObj.longitude}`
    );

    return locationObj;
  });
}

//--------weather

function Weather(weatherData) {
  this.time = weatherData.time;
  this.forecast = weatherData.summary;
}

app.get("/weather", (request, response) => {
  try {
    let weather = request.query.data;
    let weatherObj = searchWeather(weather);
    // console.log(weatherObj);
    response.send(weatherObj);
  } catch (error) {
    console.error(error);
    response.status(500).send("Sorry, something went wrong");
  }
});

function searchWeather() {
  const weatherData = require("./data/darksky.json");
  const weatherDataResults = weatherData.daily.data;
  const weatherDataArray = [];

  weatherDataResults.map(weather => {
    weatherDataArray.push(new Weather(weather));
  });
  return weatherDataArray;
}

app.get("*", (request, response) => {
  response.status(404).send("Page not found");
});

app.listen(PORT, () => console.log(`listening on port ${PORT}!`));
