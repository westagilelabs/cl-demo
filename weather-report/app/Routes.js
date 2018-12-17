/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import WeatherPage from './containers/WeatherPage';
import WeatherDetailsPage from './containers/WeatherDetailsPage';


export default () => (
  <App>
    <Switch>
      <Route path={routes.COUNTER} component={CounterPage} />
      <Route path={routes.WEATHER} component={WeatherPage} />
      <Route path={routes.WEATHER_DETAILS} component={WeatherDetailsPage} />
      <Route path={routes.HOME} component={WeatherPage} />
    </Switch>
  </App>
);
