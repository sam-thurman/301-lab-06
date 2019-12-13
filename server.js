'use strict';
//MODULES
// getting express library
const express = require('express');
const app = express();

// getting our .env and our variables
require('dotenv').config();
const PORT = process.env.PORT || 3001;

// cors is the police person of the server, tells who is allowed to talk to us
const cors = require('cors');
app.use(cors());

//allows us to get real data
const superagent = require('superagent');

//modules for functions
const handleLocation = require('./mod-lib/location/handleLocation')
const client = require('./client')

// ROUTES (for what? i dont know)

app.get('/location', handleLocation);

app.get('/weather', searchWeather);

app.get('/events', getEvents);

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
    response.send(weatherArray);
  });
}

// EVENTS

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

//MOVIES









app.get('*', (request, response) => {
  response.status(404).send('Page not found');
});

client
  .connect()
  .then(() => {
    app.listen(PORT, () => console.log(`listening on port ${PORT}!`));
  })
  .catch(err => console.error(err));


  // yelp---> you have to set the header! documentation on how to 
  // do this in superagent documentation