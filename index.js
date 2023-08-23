'use strict';
const dotenv = require('dotenv');
const express = require('express');
const app = express();
const weatherData = require('./data/weather.json');

console.log(weatherData, 'We found Weather!');

dotenv.config();
const PORT = process.env.PORT;

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

app.get('/', (req, res) => {
  res.send('weatherData');
});a

app.get('/weather', (req, res) => {
  const { lat, lon, searchQuery } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude (lat) and Longitude (lon) are required parameters.' });
  }
  const city = weatherData.find(item => item.lat === lat && item.lon === lon);
  if (!city) {
    return res.status(404).json({ error: 'City not found. Please provide valid lat and lon.' });
  }
  const forecastData = city.data.map(item => new Forecast(item.datetime, item.weather.description));

  res.json({ city: city.city_name, forecast: forecastData });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
