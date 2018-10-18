import React, { Component } from 'react'
import { 
    Card, CardImg, CardText, CardBody,
    CardTitle, Row, Col, Progress 
} from 'reactstrap'; 
import { apiKey } from '../../config/config'
import axiosInstance from '../axiosInstance'
import { Redirect } from 'react-router-dom'
import './Listing.css'
import Preloader from '../preloader/preloader';
const { ipcRenderer } = window.require('electron');
const isOnline = require('is-online');

class TopRated extends Component {
    constructor (props) {
        super (props)
        this.state = {
            topRated : [],
            page : 1,
            totalPages : 1,
            movieDetail : false,
            movieId : 0,
            setPage : false,
            loading : true
        }
        this.setNextPage = this.setNextPage.bind(this)
        this.setPrevPage = this.setPrevPage.bind(this)            
    }
    componentDidUpdate (prevProps, prevStates) {
        if(prevProps.active !== this.props.active
            && this.props.active){
            this.getTopratedMovies ()
        }
    }
    seeResponse () {
        ipcRenderer.on("topRatedCreated",(e, data) => {
            if(data) {
                console.log('///////// data added to db ////////')
            }
        })
    }
    setMovieDetail (e) {
        this.setState ({
            movieDetail : true,
            movieId : e
        })
    }
    setNextPage = () => {
        this.setState ({
            page : this.state.page + 1,
            setPage : true
        })
    }
    setPrevPage = () => {
        this.setState ({
            page : this.state.page - 1,
            setPage : true
        })
    }
    getTopratedMovies () {
        isOnline()
        .then(online => {
            if(online) {
                axiosInstance ({
                    method : 'GET',
                    url : `movie/top_rated?api_key=${apiKey}&page=${this.state.page}`
                })
                .then(res => {
                    ipcRenderer.send('topRated',res.data.results)
                    this.seeResponse()
                    this.setState ({
                        topRated : res.data.results,
                        page : res.data.page,
                        totalPages : res.data.total_pages,
                        setPage : false,
                        loading : false
                    })
                })
                .catch(error => {
                    console.log(error)
                })
            } else {
                var data = {
                    page : this.state.page,
                }
                ipcRenderer.send('topRatedFind', data)
                ipcRenderer.on('topRatedData', (e, res) => {
                    this.setState ({
                        topRated : res.data,
                        totalPages : res.count/20,
                        setPage : false,
                        loading : false
                    })
                })
            }
        })
    }
    render () {
        return (
            <div className="container-fluid">
                {this.state.setPage ? this.getTopratedMovies() : null}
                <h1>Top Rated Movies</h1>
                { !this.state.loading ?  
                    (this.state.topRated.length > 0 ? 
                        <div>
                            <Row>
                                {this.state.topRated.map((e, key) => {
                                    return <Col  md="4" sm="12" key = {key} >
                                    <Card onClick = {() => this.setMovieDetail(e.dataValues ? e.dataValues.movieId : e.id )}>
                                        <CardImg top width="100px"  src={`https://image.tmdb.org/t/p/w500/${e.dataValues ? e.dataValues.imagePath : e.poster_path}`} alt={e.title} />
                                        <CardBody>
                                        <CardTitle>{e.dataValues ? e.dataValues.name : e.title }</CardTitle>
                                        <CardText >{e.overview || e.dataValues? (e.overview || e.dataValues.overview) : null}</CardText>
                                        </CardBody>
                                    </Card>
                                </Col>
                                })}
                            </Row>
                            <div className="pagination-wrapper d-flex">
                                {
                                    this.state.page !== 1 ?
                                    <div className='loadPrev'>
                                        <span  onClick={() => this.setPrevPage()}>Prev</span>
                                    </div>
                                        : null
                                }
                                { 
                                    this.state.totalPages !== this.state.page ?
                                    <div className='ml-auto loadNext'>
                                        <span  onClick={() => this.setNextPage()}>Next</span>
                                    </div>
                                    : null
                                }
                            </div>
                        </div>
                        : <p className="no-results">No Records</p>
                    )
                    : 
                    <Preloader/>
                }
                {this.state.movieDetail ? <Redirect push to={{pathname:`/movie/${this.state.movieId}`, state : {id : this.state.movieId, category : 'topRated'}}}/> : null }
            </div>
        )
    }
}

export default TopRated;
