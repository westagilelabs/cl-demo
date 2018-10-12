import React, { Component } from 'react'
import { 
    Card, CardImg, CardText, CardBody,
    CardTitle, Row, Col 
} from 'reactstrap'; 
import { apiKey } from '../../config/config'
import axiosInstance from '../axiosInstance'
import { Redirect } from 'react-router-dom'
import { Pagination } from 'react-materialize'
import Sorting from '../Sorting/Sorting'
const { ipcRenderer } = window.require('electron');


class Listing extends Component {
    constructor (props) {
        super (props)
        this.state = {
            trendingMovies : [],
            page : 1,
            totalPages : 1,
            movieDetail : false,
            movieId : 0,
            setPage : false
        }
        this.setPage = this.setPage.bind(this)
    }
    componentDidUpdate (prevProps, prevStates) {
        if(prevProps.active !== this.props.active
            && this.props.active){
                this.getTrendingMovies ()
            }
    }
    getTrendingMovies () {
        axiosInstance ({
            method : 'GET',
            url : `trending/all/day?api_key=${apiKey}&page=${this.state.page}`
        })
        .then(res => {
            console.log(res.data)
            ipcRenderer.send("trending", res.data.results)
            this.setState ({
                trendingMovies : res.data.results,
                page : res.data.page,
                totalPages : res.data.total_pages,
                setPage : false
            })
            ipcRenderer.on("trendingCreated",(e, data) => {
                if(data.length > 0) {
                    console.log('///////// data added to db ////////')
                }
            })
        })
        .catch(error => {
            console.log(error)
        })
    }
    setMovieDetail (e) {
        this.setState ({
            movieDetail : true,
            movieId : e
        })
    }
    setPage (e) {
        this.setState ({
            page : e,
            setPage : true
        })
    }
    render () {
        return (
            <div className="container-fluid">
            {this.state.setPage ? this.getTrendingMovies() : null}
                <h1>Trending Movies</h1>
                    {this.state.trendingMovies.length > 0 ? 
                        <div className="movies-wrapper">
                            <Row>
                                {this.state.trendingMovies.map((e, key) => {
                                    return <Col sm="12" md="4" lg="3" key = {key} >
                                    <Card onClick = {() => this.setMovieDetail(e.id)}>
                                        <CardImg top width="100px" src={`https://image.tmdb.org/t/p/w500/${e.poster_path}`} alt={e.title} />
                                        <CardBody>
                                            <CardTitle>{e.title}</CardTitle>
                                            <CardText >{e.overview}</CardText>
                                        </CardBody>
                                    </Card>
                                </Col>
                                })}
                            </Row>
                        </div>
                    : <p>No Records</p>}
                {this.state.movieDetail ? <Redirect push to={{pathname:`/movie/${this.state.movieId}`, state : {id : this.state.movieId}}}/> : null }
                <div>
                    <Pagination className = "pagination" item = {this.state.totalPages} activePage = {this.state.page} maxButtons = {this.state.totalPages} onSelect = {this.setPage}/>
                </div>
            </div>
        )
    }
}
export default Listing