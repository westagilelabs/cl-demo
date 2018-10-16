import React, { Component } from 'react'
import { 
    Card, CardImg, CardText, CardBody,
    CardTitle, Row, Col, Progress 
} from 'reactstrap'; 
import { apiKey } from '../../config/config'
import axiosInstance from '../axiosInstance'
import { Redirect } from 'react-router-dom'
import PaginationComp from './Pagination'
const { ipcRenderer } = window.require('electron');
const isOnline = require('is-online');

class NowPlaying extends Component {
    constructor (props) {
        super (props)
        this.state = {
            nowPlaying : [],
            page : 1,
            totalPages : 1,
            movieDetail : false,
            movieId : 0,
            setPage : false,
            loading : true
        }
        this.setPage = this.setPage.bind(this)        
    }

    componentDidUpdate (prevProps, prevStates) {
        if(prevProps.active !== this.props.active
            && this.props.active){
                this.getNowPlayingMovies ()
        }
    }
    setMovieDetail (e) {
        this.setState ({
            movieDetail : true,
            movieId : e
        })
    }
    getNowPlayingMovies () {
        isOnline()
        .then(online => {
            if(online) {
                axiosInstance ({
                    method : 'GET',
                    url : `movie/now_playing?api_key=${apiKey}&page=${this.state.page}`
                })
                .then(res => {
                    ipcRenderer.send("nowPlaying", res.data.results)
                    this.seeResponse ()
                    this.setState ({
                        nowPlaying : res.data.results,
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
                ipcRenderer.send('nowPlayingFind', data)
                ipcRenderer.on('nowPlayingData', (e, res) => {
                    this.setState ({
                        nowPlaying : res.data,
                        totalPages : res.count/20,
                        setPage : false,
                        loading : false
                    })
                })
            }
        })
    }
    seeResponse () {
        ipcRenderer.on("nowPlayingCreated",(e, data) => {
            if(data) {
                console.log('///////// data added to db ////////')
            }
        })
    }
    setPage = (e) => {
        this.setState ({
            page : e,
            setPage : true
        })
    }
    render () {
        return (
            <div className="container-fluid">
                {this.state.setPage ? this.getNowPlayingMovies() : null}
                <h1>Now Playing Movies</h1>
                { !this.state.loading ?  
                    (this.state.nowPlaying.length > 0 ? 
                        <div className="movies-wrapper">
                            <Row>
                                {this.state.nowPlaying.map((e, key) => {
                                    return <Col  md="4" sm="12" key = {key} >
                                        <Card onClick = {() => this.setMovieDetail(e.dataValues ? e.dataValues.movieId : e.id )}>
                                            <CardImg top width="100px"  src={`https://image.tmdb.org/t/p/w500/${e.dataValues ? e.dataValues.imagePath : e.poster_path}`} alt={e.title} />
                                            <CardBody>
                                            <CardTitle>{e.dataValues ? e.dataValues.name : e.title }</CardTitle>
                                            <CardText >{e.overview || e.dataValues.overview}</CardText>
                                            </CardBody>
                                    </Card>
                                </Col>
                                })}
                            </Row>
                            </div>
                        : <p>No Records</p>
                    )
                    : 
                    <div><Progress animated color="success" value={2 * 5}/></div>
                }
                {this.state.movieDetail ? <Redirect push to={{pathname:`/movie/${this.state.movieId}`, state : {id : this.state.movieId, category : 'nowPlaying'}}}/> : null }
                <PaginationComp totalPages={this.state.totalPages} page={this.state.page} setPage={this.setPage}/>
            </div>
        )
    }
}

export default NowPlaying;
