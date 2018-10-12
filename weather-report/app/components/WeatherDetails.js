/* eslint-disable */
// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row } from 'reactstrap';
import Chart from 'react-google-charts';
import styles from './Weather.css';
import routes from '../constants/routes';

let tempData = [['day', 'Temperature']];
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

  componentWillUnmount() {
    // this.props.clearStates();
  }

  render() {
    console.log('results ==>', this.props);
    if (this.props.forecast) {
      let temp, date, description, hours;
      this.props.forecast.list.map(forecast => {
        console.log(JSON.stringify(forecast));
        temp = Math.floor(forecast.main.temp - 273.15);
        description = forecast.weather[0].description;
        console.log('description', description);
        date = new Date(forecast.dt_txt);
        hours = date.getHours();
        return tempData.push([date, temp]);
      });
    }
    console.log('data', tempData);
    return (
      <div>
        <div className={styles.backButton} data-tid="backButton">
          <Link to={routes.WEATHER}>
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>

        <Row>
          Weather in {this.props.results.name}, {this.props.results.sys.country}{' '}
          {Math.floor(this.props.results.main.temp - 273.15)}
          °С
        </Row>

        <div className="App">
          <Chart
            chartType="LineChart"
            width="800px"
            height="400px"
            data={tempData}
            options={options}
          />
        </div>
      </div>
    );
  }
}
