DROP TABLE location;

CREATE TABLE IF NOT EXISTS location(
  id SERIAL PRIMARY KEY,
  formatted_query VARCHAR(255),
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  city VARCHAR(255)
);


DROP TABLE weather;

CREATE TABLE IF NOT EXISTS weather(
  id SERIAL PRIMARY KEY,
  time VARCHAR(255),
  forecast VARCHAR(255)
);


DROP TABLE events;

CREATE TABLE IF NOT EXISTS events(
  id SERIAL PRIMARY KEY,
  link VARCHAR(255),
  name VARCHAR (255),
  event_date VARCHAR(255),
  summary VARCHAR(500)
)

