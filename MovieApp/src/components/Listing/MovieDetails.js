import React, { Component } from 'react'
import { 
    Card, CardImg, CardText, CardBody,
    CardTitle, Row, Col 
} from 'reactstrap'; 
import { apiKey } from '../../config/config'
import axiosInstance from '../axiosInstance'
import { Link } from "react-router-dom";


class MovieDetails extends Component {
    constructor (props) {
        super (props) 
        console.log(this.props)
        this.state = {
            movieDetails : {},
            id : this.props.location.state ? this.props.location.state.id : Number(this.props.location.pathname.split('/')[2])
        }
        this.getMovieDetails = this.getMovieDetails.bind(this)
    }

    componentDidMount () {
        this.getMovieDetails ()
    }

    getMovieDetails () {
        axiosInstance ({
            method : 'GET',
            url : `movie/${this.state.id}?api_key=${apiKey}`
        })
        .then(res => {
            this.setState ({
                movieDetails : res.data
            })
        })
        .catch (error => {
            console.log(error)
        })
    }
    render () {
        return (
            <div  className="container-fluid">
            <Link to={{pathname:'/'}}>home</Link>
                <h1>Movie details</h1>
                {Object.keys(this.state.movieDetails).length > 0  ? 
                    <Row>
                    <Col  md="4" sm="12" >
                        <Card>
                            <CardImg top width="100px" src={`https://image.tmdb.org/t/p/w500/${this.state.movieDetails.poster_path}`} alt={this.state.movieDetails.title} />
                            <CardBody>
                            <CardTitle>{this.state.movieDetails.title}</CardTitle>
                            <CardText >{this.state.movieDetails.overview}</CardText>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                : null}
            </div>
        )
    }
}
export default MovieDetails;