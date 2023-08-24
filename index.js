'use strict';
const axios = require('axios');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
// const weatherData = require(`./data/weather.json`);
dotenv.config();
const PORT = process.env.PORT;
const WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY;
const app = express();
app.use(cors());

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
    console.log(datetime);
    forecastData.push(new Forecast(weather.data[i].weather.description, datetime));
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


