/* eslint-disable */
// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Row} from 'reactstrap';
import Chart from "react-google-charts";
import styles from './Weather.css';
import routes from '../constants/routes';

const data = [
    [
      { type: 'date', label: 'Day' },
      'Average temperature',
      'Average hours of daylight',
    ],
      [new Date(2014, 0), -0.5, 5.7],
      [new Date(2014, 1), 0.4, 8.7],
      [new Date(2014, 2), 0.5, 12],
      [new Date(2014, 3), 2.9, 15.3],
      [new Date(2014, 4), 6.3, 18.6],
      [new Date(2014, 5), 9, 20.9],
      [new Date(2014, 6), 10.6, 19.8],
      [new Date(2014, 7), 10.3, 16.6],
      [new Date(2014, 8), 7.4, 13.3],
      [new Date(2014, 9), 4.4, 9.9],
      [new Date(2014, 10), 1.1, 6.6],
      [new Date(2014, 11), -0.2, 4.5],
];
const options={
  chart: {
    title:
      'Average Temperatures and Daylight in Iceland Throughout the Year',
  },
  width: 900,
    height: 500,
    series: {
    // Gives each series an axis name that matches the Y-axis below.
    0: { axis: 'Temps' },
    1: { axis: 'Daylight' },
  },
  axes: {
    // Adds labels to each axis; they don't have to match the axis names.
    y: {
      Temps: { label: 'Temps (Celsius)' },
      Daylight: { label: 'Daylight' },
    },
  }
}

export default class Weather extends Component {

  constructor(props){
    super(props);
  }

  componentDidMount(){
    if(this.props.results.name){
      this.props.fetchWeatherForecast(this.props.results.name);
    }
  }

  render() {
    console.log("results ==>",this.props);
    if(this.props.forecast){
          data = this.props.forecast.list.map((forecast,index) => {

          })
    }
    return (
      <div>
        <div className={styles.backButton} data-tid="backButton">
          <Link to={routes.WEATHER}>
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>

        <Row>
          Weather in {this.props.results.name}, {this.props.results.sys.country} {Math.floor(this.props.results.main.temp - 273.15)}°С
        </Row>

        <div className="App">
          <Chart
            chartType="LineChart"
            width="100%"
            height="400px"
            data={data}
            options={options}
          />
        </div>
      </div>
    );
  }
}
