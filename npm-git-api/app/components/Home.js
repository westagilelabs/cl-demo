// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Home.css';

type Props = {
  
};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h4>Welcome to</h4>
        <h2>NPM Package Analysis</h2>
        <Link to={routes.COUNTER}>Click to here to go the list of npm dependencies</Link>
      </div>
    );
  }
}
