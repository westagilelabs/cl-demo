import React, { Component } from 'react';
import bannerImg from '../images/news-banner.jpg';
import logoImg from '../images/logo.png';
import styles from './Banner.css';


export default class Banner extends Component {
  render() {
    return (
      <div className={styles.bannerContainer}>
      <header>
          <img src={logoImg} />
          <h3 className={styles.heading}>News Client</h3>
      </header>
        <img src={bannerImg} width="100%" />
      </div>
    )
  }
}
