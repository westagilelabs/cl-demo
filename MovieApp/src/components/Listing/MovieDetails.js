import React, { Component } from 'react'
import { 
    Media 
} from 'reactstrap'; 
import { apiKey, guestSessionId } from '../../config/config'
import axiosInstance from '../axiosInstance'
import { Link } from "react-router-dom";
import Rating from './Rating';
const { ipcRenderer } = window.require('electron');
const isOnline = require('is-online');

class MovieDetails extends Component {
    constructor (props) {
        super (props) 
        this.state = {
            movieDetails : {},
            id : this.props.location.state ? this.props.location.state.id : Number(this.props.location.pathname.split('/')[2]),
            rating : 0,
            setRating : false
        }
        this.getMovieDetails = this.getMovieDetails.bind(this)
    }

    componentDidMount () {
        this.setState ({
            id : this.props.location.state ? this.props.location.state.id : Number(this.props.location.pathname.split('/')[2]),
        })
        this.getMovieDetails ()
    }

    getMovieDetails () {
        isOnline()
        .then(online => {
            if(online) {
                axiosInstance ({
                    method : 'GET',
                    url : `movie/${this.state.id}?api_key=${apiKey}`
                })
                .then(res => {
                    this.setState ({
                        movieDetails : res.data,
                        setRating : !this.state.setRating
                    })
                })
                .catch (error => {
                    console.log(error)
                })
            } else {
                var data = {
                    id : this.state.id,
                    category : this.props.location.state ? this.props.location.state.category : ''
                }
                ipcRenderer.send('findMovieDetails', data)
                this.setDetails ()
            }
        })
        
    }
    setDetails () {
        ipcRenderer.on('movieDetails', (e, data) => {
            this.setState ({
                movieDetails : data.dataValues
            })
        })
    }
    setRating = (data) => {
        axiosInstance ({
            method : 'POST',
            url : `movie/${this.state.id}/rating?api_key=${apiKey}&guest_session_id=${guestSessionId}`,
            data : {
                value : data
            }
        })
        .then(res => {
            console.log('rating is done')
        })
        .catch (error => {
            console.log(error)
        })
    }
    render () {
        return (
            <div  className="container-fluid">
            <Link to={{pathname:'/', category : this.props.location.state ? this.props.location.state.category : ''}}>home</Link>
                <h1>Movie details</h1>
                {this.state.setRating ? <Rating setRating = {this.setRating}/> : null}
                {Object.keys(this.state.movieDetails).length > 0  ? 
                    <div className="movie-details-wrapper">
                        <Media>
                            <Media left >
                                <Media 
                                    object 
                                    src={`https://image.tmdb.org/t/p/w500/${this.state.movieDetails.poster_path || this.state.movieDetails.imagePath}`}
                                    alt={this.state.movieDetails.title} 
                                />
                            </Media>
                            <Media body>
                                <Media heading>
                                    Title : {this.state.movieDetails.title || this.state.movieDetails.name} {this.state.movieDetails.tagline ? (<span style={{fontSize:'15px'}}>{this.state.movieDetails.tagline }</span> ): null}
                                </Media>
                                {this.state.movieDetails.release_date ? <b style={{fontSize:'18px'}}>Release Date </b> - (this.state.movieDetails.release_date) : null} 
                                {this.state.movieDetails.runtime ? <b style={{fontSize:'18px'}}>Run time </b>- (this.state.movieDetails.runtime) : null} 
                                {this.state.movieDetails.revenue ? <b style={{fontSize:'18px'}}>Revenue </b>- (this.state.movieDetails.revenue) : null  }<br/>
                                <b style={{fontSize:'18px'}}>Rating </b>: {this.state.movieDetails.vote_average || this.state.movieDetails.rating} / 10 <br/>
                                <b style={{fontSize:'18px'}}>Overview </b>: {this.state.movieDetails.overview}
                            </Media>
                        </Media>
                    </div>
                    : null
                }
            </div>
        )
    }
}
export default MovieDetails;
