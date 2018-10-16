/* eslint-disable */
import { getWeatherData, getWeatherForecast } from '../api/getWeatherData';
import { Weather } from '../src/model';
import { listAll, insertCityWeather, upsert } from '../src/WeatherModel';

async function fetchWeatherData(city) {
  try {
    let data = {};
    const response = await getWeatherData(city);
    if (response.data) {
      data = {
        id: response.data.id, //2643743,
        city: response.data.name, //"Pune",
        temperature: Math.floor(response.data.main.temp - 273.15), //32,
        temp_min: Math.floor(response.data.main.temp_min - 273.15), //32,
        temp_max: Math.floor(response.data.main.temp_max - 273.15), //32,
        country: response.data.sys.country, //"IN",
        description: response.data.weather[0].description, //"few clouds",
        windSpeed: response.data.wind.speed, //"1.96 ",
        coordLat: response.data.coord.lat, //"18.52",
        coordLon: response.data.coord.lon, //"73.85",
        clouds: response.data.clouds.all,
        pressure: response.data.main.pressure,
        humidity: response.data.main.humidity,
        sunrise: response.data.sys.sunrise,
        sunset: response.data.sys.sunset
      };
      upsert(data, data.id);
      const list = listAll();
      console.log('this is list-->', list);
    }
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function fetchWeatherForecast(city) {
  try {
    const response = await getWeatherForecast(city);
    let data = {};
    if (response.data) {
      data = {
        temperature: Math.floor(forecast.list.main.temp - 273.15)
      };
    }
    return response;
  } catch (error) {
    console.log(error);
  }
}

export { fetchWeatherData, fetchWeatherForecast };
