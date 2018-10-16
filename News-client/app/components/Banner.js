import React, { Component } from 'react';
import bannerImg from '../images/news-banner.jpg';
import styles from './Banner.css';


export default class Banner extends Component {
  render() {
    return (
      <div className={styles.bannerContainer}>
        <img src={bannerImg} width="100%" />
        <h3 className={styles.heading}>News Client</h3>
      </div>
    )
  }
}
