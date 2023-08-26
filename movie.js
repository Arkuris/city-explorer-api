'use strict';
const axios = require('axios');

const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const movieData = require(`./data/weather.json`);
// dotenv.config();
// const PORT = process.env.PORT;
// const app = express();
// app.use(cors());

class Movie {
  constructor(movieValue) {
    this.title = movieValue.title;
    this.overview = movieValue.overview;
    this.average_votes = movieValue.vote_average;
    this.total_votes = movieValue.vote_count;
    this.image_url = movieValue.poster_path;
    this.popularity = movieValue.popularity;
    this.release_on = movieValue.release_date;
  }
}

function pullMovieData(movieData) {
  const movieArray = [];

  for (let i = 0; i < movieData.length; i++) {
    if (movieData[i].poster_path) {
      let newMovieObject = new Movie({
        title: movieData[i].original_title,
        overview: movieData[i].overview,
        average_votes: movieData[i].vote_average,
        total_votes: movieData[i].vote_count,
        image_url: `https://image.tmdb.org/t/p/w500${movieData[i].
          poster_path}`
      });
      movieArray.push(newMovieObject);
    }
  }
  return movieArray;
}

const movieFunction = async (request, response) => {
  let cityName = request.query.cityName;
  console.log(cityName);
  const movieApiUrl = `https://api.themoviedb.org/3/search/movie?query=${cityName}&api_key=${MOVIE_API_KEY}`;

  try {
    const rawMovieData = await axios.get(movieApiUrl);
    let formattedMovies = pullMovieData(rawMovieData.data.results);
    response.status(200).send(formattedMovies);
  } catch (error) {
    console.log(error);
    response.status(500).send(`Rip. ${error}`);
  }
};
// app.listen(PORT), () => console.log(`Listening on port ${PORT}.`);

module.exports = movieFunction;
