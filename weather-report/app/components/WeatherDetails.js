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

  componentDidUpdate(prevProps, prevStates){

    // if(prevProps.forecast.length !== this.props.forecast.length){
    //   tempData = [['day', 'Temperature']];
    // }

  }

  getTimeFromTimeStamp(timeStamp){
    let date = new Date(timeStamp);
// Hours part from the timestamp
    let hours = date.getUTCHours();
// Minutes part from the timestamp
    let minutes = "0" + date.getUTCMinutes();
// Seconds part from the timestamp
    let seconds = "0" + date.getUTCSeconds();
    return(hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2));
  }

  componentWillUnmount() {
    // this.props.clearStates();
  }

  render() {
    let tempData = [['day', 'Temperature']];
    if (this.props.forecast) {

      let temp, date, description, hours;
      this.props.forecast.list.map(forecast => {
        console.log(JSON.stringify(forecast));
        temp = Math.floor(forecast.main.temp - 273.15);
        description = forecast.weather[0].description;
        date = new Date(forecast.dt_txt);
        hours = date.getHours();
        return tempData.push([date, temp]);
      });
    }
    let wind = this.props.results.wind.speed,
      cloudiness = this.props.results.clouds.all,
      pressure = this.props.results.main.pressure,
      humidity = this.props.results.main.humidity,
      sunrise = this.getTimeFromTimeStamp(this.props.results.sys.sunrise),
      sunset =this.getTimeFromTimeStamp(this.props.results.sys.sunset),
      lon = this.props.results.coord.lon,
      lat = this.props.results.coord.lat;
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
