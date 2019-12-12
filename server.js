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

//PG (maybe postgresql?)

const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL);
client.on("error", err => console.error(err));

// ROUTES (for what? i dont know)

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

app.get("/events", getEvents);

app.get("/add", (request, response) => {
  // let formatted_query = request.query.formatted;
  // let latitude = request.query.lat;
  // let longitude = request.query.long;
});

//LOCATION

function Location(request, geoData) {
  this.search_query = request;
  this.formatted_query = geoData.body.results[0].formatted_address;
  this.latitude = geoData.body.results[0].geometry.location.lat;
  this.longitude = geoData.body.results[0].geometry.location.lng;
}

function searchLatToLong(request, response) {
  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request}&key=${process.env.GEOCODE_API_KEY}`;
  superagent.get(url).then(results => {
    const locationObj = new Location(request, results);
    // console.log(results.body);
    console.log(typeof locationObj.latitude);
    console.log("*************************");

    console.log(
      `${locationObj.formatted_query} has a latitude of: ${locationObj.latitude} and a longitude of: ${locationObj.longitude}`
    );
    let sql = 'INSERT INTO location(formatted_query, latitude, longitude) VALUES ($1, $2, $3);';
    let safeValues = [
      locationObj.formatted_query,
      locationObj.latitude,
      locationObj.longitude
    ];
    client.query(sql, safeValues);
    response.send(locationObj);
  });
}

//WEATHER

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

// EVENTS
// parse the json results before you work with it

function Event(eventData) {
  this.link = eventData.url;
  this.name = eventData.title;
  this.event_date = eventData.start_time;
  this.summary = eventData.description;
}

function getEvents(request, response) {
  let url = `http://api.eventful.com/json/events/search?location=${request.query.data.formatted_query}&app_key=${process.env.EVENTFUL_API_KEY}`;
  let eventArr = [];
  superagent.get(url).then(result => {
    let eventsJson = JSON.parse(result.text).events.event;
    // console.log(eventsJson);
    eventsJson.map(event => {
      eventArr.push(new Event(event));
    });
    // console.log(eventArr);
    response.send(eventArr);
  });
}

app.get("*", (request, response) => {
  response.status(404).send("Page not found");
});

client
  .connect()
  .then(() => {
    app.listen(PORT, () => console.log(`listening on port ${PORT}!`));
  })
  .catch(err => console.error(err));
