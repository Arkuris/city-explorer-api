'use strict';
const axios = require('axios');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
// const movieData = require(`./data/weather.json`);
dotenv.config();
const PORT = process.env.PORT;
const MOVIE_API_kEY = process.env.MOVIE_API_kEY;
const app = express();
app.use(cors());

class Movie {
  constructor(description, date) {
    this.description = description;
    this.date = date;
  }
}

async function movieCaller(lat, lon) {
  console.log(lat, lon, MOVIE_API_kEY);
  const currentMovie = `http://api.weatherbit.io/v2.0/movie/daily?key=${MOVIE_API_kEY}`;
  let movieResponse = await axios.get(`${currentMovie}`);
  return movieResponse.data;
}

function movieApiData(weather) {
  const MovieData = [];

  for (let i=0; i<movie.data.length; i++) {
    const datetime = weather.data[i].datetime;
    const atmosphere = weather.data[i].weather.description;
    const lowTemp = weather.data[i].low_temp;
    const highTemp = weather.data[i].high_temp;
    // let weatherObject = weather.data[i].weather;
    // console.log(weatherObject);
    MovieData.push(new Movie(`${datetime} It will be ${atmosphere} with a high of ${highTemp}, and low of ${lowTemp}`));
  }
  return MovieData;
}
app.get('/movie', async (req, res) => {
  if (!req.query.lat || !req.query.lon) {
    res.status(400).send('Please follow parameters');
  } else {
    try {
      let movieData = await movieCaller(req.query.lat, req.query.lon);
      console.log(movieData);
      let apiMovie =movieApiData(movieData);
      res.status(200).send(apiMovie);
    } catch (error) {
      console.log(error);
      res.status(500).send('Error fetching movie data');
    }
  }
});

app.listen(PORT, () => {
  console.log('App running.');
});
