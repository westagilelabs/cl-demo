import React, { Component } from 'react'
import { 
    Card, CardImg, CardText, CardBody,
    CardTitle, Row, Col, Progress
} from 'reactstrap'; 
import { apiKey } from '../../config/config'
import axiosInstance from '../axiosInstance'
import { Redirect } from 'react-router-dom'
import './Listing.css'
const { ipcRenderer } = window.require('electron');
const isOnline = require('is-online');


class Listing extends Component {
    constructor (props) {
        super (props)
        this.state = {
            trendingMovies : [],
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
                this.getTrendingMovies ()
            }
    }
    getTrendingMovies () {
        isOnline()
        .then(online => {
            if(online) {
                axiosInstance ({
                    method : 'GET',
                    url : `trending/all/day?api_key=${apiKey}&page=${this.state.page}`
                })
                .then(res => {
                    ipcRenderer.send("trending", res.data.results)
                    this.seeResponse()
                    this.setState ({
                        trendingMovies : res.data.results,
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
                ipcRenderer.send('trendingFind', data)
                ipcRenderer.on('trendingData', (e, res) => {
                    this.setState ({
                        trendingMovies : res.data,
                        totalPages : res.count/20,
                        setPage : false,
                        loading : false
                    })
                })
            }
        })
    }
    seeResponse () {
        ipcRenderer.on("trendingCreated",(e, data) => {
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
    render () {
        return (
            <div className="container-fluid">
                {this.state.setPage ? this.getTrendingMovies() : null}
                <h1>Trending Movies</h1>
                { !this.state.loading ?  
                    (this.state.trendingMovies.length > 0 ? 
                        <div className="movies-wrapper">
                            <Row>
                                    {this.state.trendingMovies.map((e, key) => {
                                    return <Col  md="4" sm="12" key = {key} >
                                    <Card onClick = {() => this.setMovieDetail(e.dataValues ? e.dataValues.movieId : e.id )}>
                                        <CardImg top width="100px" src={`https://image.tmdb.org/t/p/w500/${e.dataValues ? e.dataValues.imagePath : e.poster_path}`} alt={e.title} />
                                        <CardBody>
                                        <CardTitle>{e.dataValues ? e.dataValues.name : e.title }</CardTitle>
                                        <CardText >{e.overview || e.dataValues? (e.overview || e.dataValues.overview) : null}</CardText>
                                        </CardBody>
                                    </Card>
                                </Col>
                                })}
                            </Row>
                            {
                                this.state.page !== 1 ?
                                <div className='loadPrev'>
                                    <span  onClick={() => this.setPrevPage()}>Prev</span>
                                </div>
                                    : null
                            }
                            { 
                                this.state.totalPages !== this.state.page ?
                                <div className='loadNext'>
                                    <span  onClick={() => this.setNextPage()}>Next</span>
                                </div>
                                : null
                            }
                            
                        </div>
                        : 
                        <p>No Records</p>
                    )    
                    :   <div><Progress animated color="success" value={2 * 5}/></div>
                    }
                {this.state.movieDetail ? <Redirect push from='/trending' to={{pathname:`/movie/${this.state.movieId}`, state : {id : this.state.movieId, category : 'trending'}}}/> : null }
            </div>
        )
    }
}
export default Listing