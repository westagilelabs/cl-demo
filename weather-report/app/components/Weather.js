/* eslint-disable */
// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Input,
  InputGroup,
  InputGroupAddon,
  Row,
  Col,
  Label,
  Form,
  Button,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle
} from 'reactstrap';
import styles from './Weather.css';
import routes from '../constants/routes';

type Props = {
  fetchWeather: () => void
};

export default class Weather extends Component<Props> {
  props: Props;

  render() {
    console.log('results ==>', this.props.results);
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
      <div>
        <div className={styles.backButton} data-tid="backButton">
          <Link to={routes.HOME}>
            <i className="fa fa-arrow-left fa-3x" />
          </Link>

          <Form
            onSubmit={e => {
              e.preventDefault();
              this.props.fetchWeather(e);
            }}
            id="searchForm"
            noValidate
          >
            <Label for="searchTextBox">
              Search the weather of a city/location
            </Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend" />
              <Input
                type="text"
                id="searchTextBox"
                name="searchTextBox"
                value="Pune"
                onChange={this.props.setSearchPhrase}
                placeholder="Search"
              />
            </InputGroup>

            <Button type="submit">Search</Button>
          </Form>
        </div>
        <Row>{cityWeather}</Row>
      </div>
    );
  }
}
/* eslint-enable */
