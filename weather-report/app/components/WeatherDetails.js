/* eslint-disable */
// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row } from 'reactstrap';
import Chart from 'react-google-charts';
import styles from './Weather.css';
import routes from '../constants/routes';

// let tempData = [['day', 'Temperature']];
const options = {
  hAxis: {
    title: 'Day'
  },
  vAxis: {
    title: 'Temperature'
  }
};

export default class WeatherDetails extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.results.name) {
      this.props.fetchWeatherForecast(this.props.results.name);
    }
  }

  componentDidUpdate(prevProps, prevStates) {}

  getTimeFromTimeStamp(timeStamp) {
    let date = new Date(timeStamp);
    // Hours part from the timestamp
    let hours = date.getUTCHours();
    // Minutes part from the timestamp
    let minutes = '0' + date.getUTCMinutes();
    // Seconds part from the timestamp
    let seconds = '0' + date.getUTCSeconds();
    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  }

  componentWillUnmount() {
    // this.props.clearStates();
  }

  render() {
    let tempData = [['day', 'Temperature']];
    if (this.props.forecast) {
      let temp, date, description, hours;
      this.props.forecast.list.map(forecast => {
        temp = Math.floor(forecast.main.temp - 273.15);
        description = forecast.weather[0].description;
        date = new Date(forecast.dt_txt);
        hours = date.getHours();
        return tempData.push([date, temp]);
      });
    }
    let wind = this.props.results.windSpeed,
      cloudiness = this.props.results.clouds,
      pressure = this.props.results.pressure,
      humidity = this.props.results.humidity,
      sunrise = this.getTimeFromTimeStamp(this.props.results.sunrise),
      sunset = this.getTimeFromTimeStamp(this.props.results.sunset),
      lon = this.props.results.coordLon,
      lat = this.props.results.coordLat;
    return (
      <div className="container-fluid">
        <div className={styles.backButton} data-tid="backButton">
          <Link to={routes.WEATHER}>
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>

        <Row>
          Weather in {this.props.results.city}, {this.props.results.country}{' '}
          {Math.floor(this.props.results.temperature - 273.15)}
          °С
        </Row>
        {/*This is temperature graph div*/}
        <div className="App">
          <Chart
            chartType="LineChart"
            width="800px"
            height="400px"
            data={tempData}
            options={options}
          />
          {/*this is overview div*/}
          <div>
            <div>
              <span> Wind </span> <span> {wind} m/s</span>
            </div>
            <div>
              <span> Cloudiness </span> <span> {cloudiness} </span>
            </div>
            <div>
              <span> Pressure </span> <span> {pressure} </span>
            </div>
            <div>
              <span> Humidity </span> <span> {humidity} </span>
            </div>
            <div>
              <span> Sunrise </span> <span> {sunrise} </span>
            </div>
            <div>
              <span> Sunset </span> <span> {sunset} </span>
            </div>
            <div>
              <span> Geo Coords </span> <span> {`[${lon},${lat}]`} </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
