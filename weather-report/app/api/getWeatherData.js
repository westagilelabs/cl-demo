import axios from "axios";
import API_KEY from "../constants/appKeys";

export function getWeatherData (name){
  return axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${name}&APPID=${API_KEY}`);
}

export function getWeatherForecast (name){
  return axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${name}&APPID=${API_KEY}`);
}


