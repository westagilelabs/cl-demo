/* eslint-disable */
// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
import BgImage from '../assets/images/clouds.gif';

type Props = {
  fetchWeather: () => void
};

export default class Weather extends Component<Props> {
  props: Props;

  render() {
    let cityWeather = '';
    if (this.props.results) {
      cityWeather = (
        <Col>
          <Card>
            <CardBody>
              <CardTitle>
                <Link to={routes.WEATHER_DETAILS} replace>
                  {' '}
                  {this.props.results.name}, {this.props.results.sys.country}{' '}
                  {this.props.results.weather[0].description}{' '}
                </Link>{' '}
              </CardTitle>
              <CardSubtitle>
                {Math.floor(this.props.results.main.temp - 273.15)}
                °С
              </CardSubtitle>
              <CardText>
                Temp : from{' '}
                {Math.floor(this.props.results.main.temp_min - 273.15)} to{' '}
                {Math.floor(this.props.results.main.temp_max - 273.15)} °С,
              </CardText>
              <CardText>
                {' '}
                wind {this.props.results.wind.speed} m/s. clouds{' '}
                {this.props.results.clouds.all} %, 1011 hpa{' '}
              </CardText>
              <CardText>
                Geo coords [{this.props.results.coord.lat},{' '}
                {this.props.results.coord.lon}]
              </CardText>
            </CardBody>
          </Card>
        </Col>
      );
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
          <div className="container-fluid">
            <Row>{cityWeather}</Row>
          </div>
        </div>
      </div>
    );
  }
}
/* eslint-enable */
