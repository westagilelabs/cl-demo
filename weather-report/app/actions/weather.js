import {getWeatherData,getWeatherForecast} from "../api/getWeatherData";


async function fetchWeatherData(city) {
  try {
    const response = await getWeatherData(city);
    return response;
  } catch (error) {
    console.log(error);
  }
}

async function fetchWeatherForecast(city) {
  try {
    const response = await getWeatherForecast(city);
    return response;
  } catch(error) {
    console.log(error);
  }
}


export {fetchWeatherData,fetchWeatherForecast};
