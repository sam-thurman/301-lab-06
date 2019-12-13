'use strict';
//MODULES
const searchLatToLong = require('./searchLatToLong');

function handleLocation(request, response) {
  try {
    let city = request.query.data;
    let locationObj = searchLatToLong(city, response);
  } catch (error) {
    console.error(error);
    response.status(500).send("Sorry, something went wrong");
  }
};

module.exports = handleLocation;