/* eslint-disable */
import { connect } from 'react-redux';
// import your child components
import Weather from '../components/Weather';
import { fetchWeatherData } from '../actions/weather';

const mapStateToProps = state => {
  return {
    weatherData: state.weather,
    cityName: state.city,
    results: state.weather.results
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchWeather: async event => {
      const results = await fetchWeatherData(event.target[0].value);
      await dispatch(
        () =>
          new Promise(resolve => {
            resolve(
              dispatch({ type: 'PUSH_WEATHER_RESULTS', val: results.data })
            );
          })
      );
    },
    setSearchPhrase: event =>
      dispatch({ type: 'SET_SEARCH_PHRASE', val: event.target.value }),
    clearState: () => dispatch({ type: 'CLEAR_WEATHER_STATE' })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Weather);
/* eslint-enable */
