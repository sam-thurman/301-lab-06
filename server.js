'use strict';

// getting express library
const express = require('express');
const app = express();

//DOTENV getting our .env and our variables
require('dotenv').config();
const PORT = process.env.PORT || 3001;

//CORS is the police person of the server, tells who is allowed to talk to us
const cors = require('cors');
app.use(cors());

//SUPERAGENT allows us to get real data
const superagent = require('superagent');

//MODULES for functions
const client = require('./client');
const handleLocation = require('./mod-lib/location/handleLocation');
const searchWeather = require('./mod-lib/weather/searchWeather');
const getEvents = require('./mod-lib/events/getEvents');
const getMovies = require('./mod-lib/movies/getMovies');
const getYelps = require('./mod-lib/yelp/getYelps');

// ROUTES 

app.get('/location', handleLocation);

app.get('/weather', searchWeather);

app.get('/events', getEvents);

app.get('/movies', getMovies);

app.get('/yelp', getYelps);

app.get('*', (request, response) => {
  response.status(404).send('Page not found');
});

client
  .connect()
  .then(() => {
    app.listen(PORT, () => console.log(`listening on port ${PORT}!`));
  })
  .catch(err => console.error(err));

