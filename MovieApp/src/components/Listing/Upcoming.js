import React, { Component } from 'react'
import { 
    Card, CardImg, CardText, CardBody,
    CardTitle, Row, Col 
} from 'reactstrap'; 
import { apiKey } from '../../config/config'
import axiosInstance from '../axiosInstance'
import { Redirect } from 'react-router-dom'
import PaginationComp from './Pagination'
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
            setPage : false
        }
        this.setPage = this.setPage.bind(this)                        
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
    setPage = (e) => {
        this.setState ({
            page : e,
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
                        setPage : false                
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
                ipcRenderer.on('upComingData', (e, data) => {
                    console.log(data)
                    this.setState ({
                        upComing : data,
                        totalPages : data.length/20,
                        setPage : false
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
                {this.state.upComing.length > 0 ? 
                <div className="container-fluid">
                <Row>
                    {this.state.upComing.map((e, key) => {
                        return <Col  md="4" sm="12" key = {key} >
                        <Card onClick = {() => this.setMovieDetail(e.dataValues ? e.dataValues.movieId : e.id )}>
                            <CardImg top width="100px" src={`https://image.tmdb.org/t/p/w500/${e.dataValues ? e.dataValues.imagePath : e.poster_path}`} alt={e.title} />
                            <CardBody>
                            <CardTitle>{e.dataValues ? e.dataValues.name : e.title }</CardTitle>
                            <CardText >{e.overview || e.dataValues.overview}</CardText>
                            </CardBody>
                        </Card>
                    </Col>
                    })}
                </Row>
                </div>
                : <p>No Records</p>}
                {this.state.movieDetail ? <Redirect push to={{pathname:`/movie/${this.state.movieId}`, state : {id : this.state.movieId, category : 'upComing'}}}/> : null }
                <PaginationComp totalPages={this.state.totalPages} page={this.state.page} setPage={this.setPage}/>
            </div>
        )
    }
}

export default UpComing;
