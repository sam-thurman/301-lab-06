// Sam T
'use strict';

const Yelp = require('./Yelp')
const superagent = require('superagent');

function getYelps(request, response) {
  let url = `https://api.yelp.com/v3/businesses/search?latitude=${request.query.data.latitude}&longitude=${request.query.data.longitude}`;
  let yelpArr = [];
  superagent.get(`${url}`).set('Authorization', `Bearer ${process.env.YELP_API_KEY}`).then(result => {
    result.body.businesses.map(business => {
      yelpArr.push(new Yelp(business))
    })
    response.send(yelpArr)
  })
};

module.exports = getYelps;