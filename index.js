'use strict';
const axios = require('axios');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
// const weatherData = require(`./data/weather.json`);
dotenv.config();
const PORT = process.env.PORT;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
const WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY;
const movieScript = require('./movie.js');
const app = express();
app.use(cors());

app.get('/movie', movieScript);

class Forecast {
  constructor(description, date) {
    this.description = description;
    this.date = date;
  }
}

async function locationWeather(lat, lon) {
  console.log(lat, lon, WEATHERBIT_API_KEY);
  const currentWeather = `http://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHERBIT_API_KEY}&lat=${lat}&lon=${lon}`;
  let weatherResponse = await axios.get(`${currentWeather}`);
  return weatherResponse.data;
}

function weatherApiData(weather) {
  const forecastData = [];

  for (let i=0; i<weather.data.length; i++) {
    const datetime = weather.data[i].datetime;
    const atmosphere = weather.data[i].weather.description;
    const lowTemp = weather.data[i].low_temp;
    const highTemp = weather.data[i].high_temp;
    // let weatherObject = weather.data[i].weather;
    // console.log(weatherObject);
    forecastData.push(new Forecast(`${datetime} It will be ${atmosphere} with a high of ${highTemp}, and low of ${lowTemp}`));
  }
  return forecastData;
}
app.get('/weather', async (req, res) => {
  if (!req.query.lat || !req.query.lon) {
    res.status(400).send('Please follow parameters');
  } else {
    try {
      let weatherData = await locationWeather(req.query.lat, req.query.lon);
      console.log(weatherData);
      let apiWeatherForecast = weatherApiData(weatherData);
      res.status(200).send(apiWeatherForecast);
    } catch (error) {
      console.log(error);
      res.status(500).send('Error fetching weather data');
    }
  }
});

app.listen(PORT, () => {
  console.log('App running.');
});

