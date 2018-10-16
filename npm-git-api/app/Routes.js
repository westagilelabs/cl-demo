/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import PackageDetails from './containers/PackageDetails';

export default () => (
  <App>
    <Switch>
      <Route path={routes.COUNTER} component={CounterPage} />
      <Route path={routes.PACKAGE} component={PackageDetails} />
      <Route path={routes.HOME} component={HomePage} />
      
    </Switch>
  </App>
);
