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
  const currentWeather = `https://api.weatherbit.io/v2.0/current/forecast/daily?key=${WEATHERBIT_API_KEY}&lat=${lat}&lon=${lon}&units=I&days=7`;
  let weatherResponse = await axios.get(`${currentWeather}`);
  return weatherResponse.data;
}

function weatherApiData(weather) {
  const forecastData = [];

  for (let i=0; i<weather.data.length; i++) {
    const datetime = weather.data[i].datetime;
    console.log(datetime);
    forecastData.push(new Forecast(datetime));
  }
  return forecastData;
}
app.get('/weather', async (request, response) => {
  if (!request.query.city || !request.query.lat || !request.query.lon) {
    response.status(400).send('Please follow parameters');
  } else {
    let weatherData = await locationWeather(request.query.lat, request.query.lon);
    let formattedWeatherForecast = weatherApiData(weatherData);
    response.status(200).send(formattedWeatherForecast);
  }
});

app.listen(PORT, () => {
  console.log('App running.');
});


