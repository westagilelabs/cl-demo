import React, { Component } from 'react'
import { apiKey } from '../../config/config';
import axiosInstance from '../axiosInstance';
import { Redirect } from 'react-router-dom';

class Search extends Component {
    constructor (props) {
        super (props)
        this.state = {
            search : '',
            searchResults : [],
            page : 1,
            totalPages : 1,
            isFocused: false,
            searchQuery : false,
            movieDetail : false,
            movieId : 0
        }
        this.handleSearch = this.handleSearch.bind(this)
        this.getSearch = this.getSearch.bind(this)
        this.onToggleFocus = this.onToggleFocus.bind(this)
    }
    getSearch () {
        axiosInstance ({
            method : 'GET',
            url : `search/multi?api_key=${apiKey}&query=${this.state.search}&page=1&include_adult=false`
        })
        .then(res => {
            console.log(res.data)
            this.setState ({
                searchResults : res.data.results,
                page : res.data.page,
                totalPages : res.data.total_pages,
                searchQuery : !this.state.searchQuery
            })
        })
        .catch(error => {
            console.log(error)
        })
    }
    handleSearch (e) { 
        if(e.target.value.length === 0) {
            this.setState ({
                searchQuery : false,
                search : e.target.value,
                searchResults : []
            })
        }
        if(e.target.value.length > 0) {
            this.setState({
                search: e.target.value,
                searchQuery : !this.state.searchQuery
            })
        } 
    }

    onToggleFocus(){
        this.setState({
            isFocused: !this.state.isFocused
        })
    }
    setMovieDetail (e) {
        this.setState ({
            movieDetail : true,
            movieId : e
        })
    }
    
    render () {
        return (
            <div className="search-section">
                {this.state.searchQuery ? this.getSearch() : null }
                <div className="custom-search-wrapper">
                    <form className={'form-inline' + ' ' + (this.state.isFocused ? 'search-button-visible' : '')}>
                        <div className="form-search-combination">
                            <i className="fas fa-search"></i>
                            <input
                                id="searchGlobal" 
                                className="form-control"
                                type="search" 
                                placeholder="Search"
                                onBlur={this.onToggleFocus} 
                                onFocus={this.onToggleFocus} 
                                onChange={this.handleSearch}
                                value = {this.state.search}
                            />
                        </div>
                        {/* <button className="btn my-2 my-sm-0" type="button">Search</button> */}
                        <div className="search-result-overlay"></div>
                            {this.state.searchResults.length > 0 ?
                                <div className="search-result-section">
                                    <ul className="searched-lists searchlist-user">
                                    {this.state.searchResults.map((e, key) => {
                                        return <li key={key}>
                                                <span className="searched-list" onClick={() => {this.setMovieDetail(e.id)}}>{e.name || e.title}</span>
                                        </li>
                                    })}
                                    </ul>
                                </div>
                                    : null
                            }
                    </form>
                </div>
                {this.state.movieDetail ? <Redirect push to={{pathname:`/movie/${this.state.movieId}`, state : {id : this.state.movieId}}}/> : null }
            </div>
        )
    }
}
export default Search