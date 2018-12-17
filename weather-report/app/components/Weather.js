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
  fetchWeather: () => void,
  searchOffline: () => void,
  setSearchPhrase: () => void
};
let timerId;
export default class Weather extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
     online : false,
      loader : false
  };
  }
  props: Props;


  componentDidMount(){

    timerId = setInterval(()=>{
      this.setState({online : navigator.onLine})
    },2000)

  }

  componentDidUpdate(){

  }

  componentWillUnmount(){

  }

  setPreloaderStatus(){
    this.setState({
      loader : !this.state.loader
    });
  }

  render() {
    let cityWeather = '',
      details;
    console.log("this.props.result",this.props.result);
    if (this.props.results && this.props.results !== "No result found") {
      cityWeather =( <Col>
          <Card>
            <CardBody>
              <CardTitle>
                <Link to={routes.HOME} replace>
                  {' '}
                  {this.props.results.city}, {this.props.results.country},{' '}
                  {this.props.results.temperature} °С,{' '}
                  {this.props.results.description}
                </Link>{' '}
              </CardTitle>
            </CardBody>
          </Card>
        </Col>
      ) ;
      details = <WeatherDetails online={this.state.online} />;
    } else if (this.props.results === "No result found"){
      cityWeather = (<label className="no-results">No result found</label>);
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
             this.setPreloaderStatus();

              this.state.online ? this.props.fetchWeather(e) : this.props.searchOffline(e);
              setTimeout(() => {
                this.setPreloaderStatus();
              }, 1000);
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
        {this.state.loader ? <Preloader /> : ""}
      </div>

    );
  }
}
/* eslint-enable */
