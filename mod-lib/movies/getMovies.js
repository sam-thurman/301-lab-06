// Sam T
'use strict';
const Movie = require('./Movie');
const superagent = require('superagent');

function getMovies(request, response) {
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIEDB_API_KEY}&query=${request.query.data.city}`;
  const movieArr = [];

  superagent.get(url).then(result => {
    result.body.results.map(movie => {
      movieArr.push(new Movie(movie));
    })
    response.send(movieArr)
  });
};

module.exports = getMovies;