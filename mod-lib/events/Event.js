'use strict';

function Event(eventData) {
  this.link = eventData.url;
  this.name = eventData.title;
  this.event_date = eventData.start_time;
  this.summary = eventData.description;
}

module.exports = Event;