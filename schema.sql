DROP TABLE location;

CREATE TABLE IF NOT EXISTS location(
  id SERIAL PRIMARY KEY,
  formatted_query VARCHAR(255),
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7)
);


DROP TABLE weather;


DROP TABLE events;

