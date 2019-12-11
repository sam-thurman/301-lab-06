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

app.get("/location", (request, response) => {
  try {
    let city = request.query.data;
    let locationObj = searchLatToLong(city, response);
  } catch (error) {
    console.error(error);
    response.status(500).send("Sorry, something went wrong");
  }
});
// app.get("/location", searchLatToLong);
app.get("/weather", searchWeather);

//-----location

function Location(request, geoData) {
  this.search_query = request;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}

function searchLatToLong(request, response) {
  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request}&key=${process.env.GEOCODE_API_KEY}`;
  superagent.get(url).then(results => {
    const locationObj = new Location(request, results.body);
    console.log(
      `${locationObj.formatted_query} has a latitude of: ${locationObj.latitude} and a longitude of: ${locationObj.longitude}`
    );
    response.send(locationObj);
  });
}

//--------weather

function Weather(weatherData) {
  this.time = new Date(weatherData.time * 1000).toDateString();
  this.forecast = weatherData.summary;
}

function searchWeather(request, response) {
  let url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;
  let weatherArray = [];

  superagent.get(url).then(results => {
    results.body.daily.data.map(day => {
      weatherArray.push(new Weather(day));
    });
    console.log(weatherArray);
    response.send(weatherArray);
  });
}

app.get("*", (request, response) => {
  response.status(404).send("Page not found");
});

app.listen(PORT, () => console.log(`listening on port ${PORT}!`));

// events- parse the json results before you work with it
