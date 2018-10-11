import { connect } from "react-redux";
// import your child components
import WeatherDetails from "../components/WeatherDetails";
import {fetchWeatherForecast} from "../actions/weather"

const mapStateToProps = state => {
  return {
    weatherData : state.weather,
    cityName : state.city,
    results: state.weather.results,
    forecast: state.weather.forecast
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchWeatherForecast : async (name) => {
      const results = await fetchWeatherForecast(name);
      await dispatch(() => new Promise((resolve) => {
           resolve(dispatch({ type: "PUSH_WEATHER_FORECAST", val: results.data }));
        })
      )
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(WeatherDetails)
