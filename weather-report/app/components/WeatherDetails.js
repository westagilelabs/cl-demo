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
let offline = false;
export default class WeatherDetails extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
        if (this.props.results.city && !this.props.offline) {
          this.props.fetchWeatherForecast(this.props.results.city);
        }
  }

  componentDidUpdate(prevProps, prevStates) {

  }

  getTimeFromTimeStamp(timeStamp) {
    let date = new Date(parseInt(timeStamp));
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
    if (this.props.online && this.props.forecast || this.props.results.foreCast) {
      let offlineForecast = this.props.results.foreCast ? JSON.parse(this.props.results.foreCast) : [];
      let iterationArr = !this.props.online ? offlineForecast.list : this.props.forecast.list ;
      let temp, date, description, hours;
      iterationArr.map(forecast => {
        temp = forecast.temp;
        description = forecast.description;
        date = new Date(forecast[0]);
        hours = date.getHours();
        return tempData.push([date,forecast[1]]);
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
        {/* <div className={styles.backButton} data-tid="backButton">
          <Link to={routes.WEATHER}>
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div> */}

        {/* <Row>
          Weather in {this.props.results.name}, {this.props.results.sys.country}{' '}
          {Math.floor(this.props.results.main.temp - 273.15)}
          °С
        </Row> */}
        {/*This is temperature graph div*/}
        <div className="App d-flex align-items-center justify-content-between">
          <div className="climate-details-wrapper">
            <table className="table table-bordered">
              <tr>
                <th>Wind</th>
                <td>{wind} m/s</td>
              </tr>
              <tr>
                <th>Cloudiness </th>
                <td>{cloudiness}</td>
              </tr>
              <tr>
                <th>Pressure </th>
                <td>{pressure} </td>
              </tr>
              <tr>
                <th>Humidity </th>
                <td>{humidity} </td>
              </tr>
              <tr>
                <th>Sunrise </th>
                <td>{sunrise}</td>
              </tr>
              <tr>
                <th>Sunset </th>
                <td>{sunset} </td>
              </tr>
              <tr>
                <th>Geo Coords </th>
                <td>{`[${lon},${lat}]`} </td>
              </tr>
            </table>
          </div>

          <Chart
            chartType="LineChart"
            width="60vw"
            height="60vh"
            data={tempData}
            options={options}
          />
          {/*this is overview div*/}
        </div>
      </div>
    );
  }
}
