/* eslint-disable */
// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import WeatherDetails from '../containers/WeatherDetailsPage';
import {
  Row,
  Col,
  Label,
  Form,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle
} from 'reactstrap';
import styles from './Weather.css';
import routes from '../constants/routes';
import BgImage from '../assets/images/clouds2.gif';
import Preloader from './preloader/preloader';

type Props = {
  fetchWeather: () => void
};

export default class Weather extends Component<Props> {
  props: Props;

  render() {
    let cityWeather = '',
      details;
    if (this.props.results) {
      //todo : rename all the props
      cityWeather = (
        <Col>
          <Card>
            <CardBody>
              <CardTitle>
                <Link to={routes.WEATHER_DETAILS} replace>
                  {' '}
                  {this.props.results.city}, {this.props.results.country},{' '}
                  {this.props.results.temperature} °С,{' '}
                  {this.props.results.description}
                </Link>{' '}
              </CardTitle>
              <CardText>
                Temp : from {this.props.results.temp_min} to{' '}
                {this.props.results.temp_max} °С,
              </CardText>
              <CardText>
                {' '}
                wind {this.props.results.windSpeed} m/s, clouds{' '}
                {this.props.results.clouds} %, 1011 hpa{' '}
              </CardText>
              <CardText>
                Geo coords [{this.props.results.coordLat},{' '}
                {this.props.results.coordLon}]
              </CardText>
            </CardBody>
          </Card>
        </Col>
      );
      details = <WeatherDetails />;
    }
    return (
      <div className={styles.weatherDetailsWrapper}>
        <img src={BgImage} className={styles.cloudsImage} />
        <small className={styles.cloudBg} />
        <Link
          className={styles.backButton}
          to={routes.HOME}
          onClick={this.props.clearState}
          data-tid="backButton"
        >
          <i className="fa fa-arrow-left" />
        </Link>
        <div className={styles.weatherInputs}>
          <Form
            onSubmit={e => {
              e.preventDefault();
              this.props.fetchWeather(e);
            }}
            id="searchForm"
            noValidate
          >
            <Label for="searchTextBox" className={styles.inputLabel}>
              Search the weather of a city/location
            </Label>
            <div className={styles.inputGrp}>
              <input
                type="text"
                id="searchTextBox"
                name="searchTextBox"
                className={styles.inputField}
                onChange={this.props.setSearchPhrase}
                placeholder="Enter a city name here..."
              />
              <button type="submit" className={styles.inputButton}>
                Search
              </button>
            </div>
          </Form>
        </div>
        <div className={styles.weatherDetails}>
          <div className="container-fluid card-wrapper">
            <Row>{cityWeather}</Row>
          </div>
        </div>
        {details}
      </div>
    );
  }
}
/* eslint-enable */
