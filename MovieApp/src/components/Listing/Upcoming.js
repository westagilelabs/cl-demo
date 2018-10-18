import React, { Component } from 'react'
import { 
    Card, CardImg, CardText, CardBody,
    CardTitle, Row, Col,Progress 
} from 'reactstrap'; 
import { apiKey } from '../../config/config'
import axiosInstance from '../axiosInstance'
import { Redirect } from 'react-router-dom'
import './Listing.css'
const { ipcRenderer } = window.require('electron');
const isOnline = require('is-online');
class UpComing extends Component {
    constructor (props) {
        super (props)
        this.state = {
            upComing : [],
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
            this.getUpComingMovies ()
        }
    }
    
    setMovieDetail (e) {
        this.setState ({
            movieDetail : true,
            movieId : e
        })
    }
    seeResponse () {
        ipcRenderer.on("upComingCreated",(e, data) => {
            if(data) {
                console.log('///////// data added to db ////////')
            }
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
    getUpComingMovies () {
        isOnline()
        .then(online => {
            if(online) {
                axiosInstance ({
                    method : 'GET',
                    url : `movie/upcoming?api_key=${apiKey}&page=${this.state.page}`
                })
                .then(res => {
                    ipcRenderer.send('upComing',res.data.results)
                    this.seeResponse ()
                    this.setState ({
                        upComing : res.data.results,
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
                ipcRenderer.send('upComingFind', data)
                ipcRenderer.on('upComingData', (e, res) => {
                    console.log(data)
                    this.setState ({
                        upComing : res.data,
                        totalPages :res.count/20,
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
                {this.state.setPage ? this.getUpComingMovies() : null}            
                <h1>UpComing Movies</h1>
                { !this.state.loading ? 
                    (this.state.upComing.length > 0 ? 
                        <div className="container-fluid">
                        <Row>
                            {this.state.upComing.map((e, key) => {
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
                        : <p>No Records</p>
                    )
                    : 
                    <div><Progress animated color="success" value={2 * 5}/></div>
                }
                {this.state.movieDetail ? <Redirect push to={{pathname:`/movie/${this.state.movieId}`, state : {id : this.state.movieId, category : 'upComing'}}}/> : null }
            </div>
        )
    }
}

export default UpComing;
