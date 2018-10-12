// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Home.css';
import BgImage from '../assets/images/clouds.gif'

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container} data-tid="container">
          <img src={BgImage} className={styles.cloudsImage}/>
          <small className={styles.cloudBg}></small>
          <div className={styles.landingWrapper}>
            <span className={styles.logo}>It's all about WEATHER</span>
            <Link className={styles.landingLink} to={routes.WEATHER} replace>
              <i className="fab fa-mixcloud"></i>
            </Link>
          </div>
      </div>
    );
  }
}
