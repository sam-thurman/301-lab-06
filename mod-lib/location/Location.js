// Sam T
'use strict';

function Location(request, geoData) {
  this.search_query = request;
  this.formatted_query = geoData.body.results[0].formatted_address;
  this.latitude = geoData.body.results[0].geometry.location.lat;
  this.longitude = geoData.body.results[0].geometry.location.lng;
}

module.exports = Location