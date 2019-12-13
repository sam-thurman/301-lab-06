'use strict';
const superagent = require('superagent');
const Event = require('./Event')

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

module.exports = getEvents