import React, { Component } from 'react'
import { apiKey } from '../../config/config';
import axiosInstance from '../axiosInstance'

class Search extends Component {
    constructor (props) {
        super (props)
        this.state = {
            search : '',
            searchResults : [],
            page : 1,
            totalPages : 1,
            isFocused: false
        }
        this.handleSearch = this.handleSearch.bind(this)
        this.getSearch = this.getSearch.bind(this)
        this.onToggleFocus = this.onToggleFocus.bind(this)
    }
    getSearch () {
        axiosInstance ({
            method : 'GET',
            url : `/search/multi?query=${this.state.search}?api_key=${apiKey}`
        })
        .then(res => {
            console.log(res.data)
            this.setState ({
                searchResults : res.data.results,
                page : res.data.page,
                totalPages : res.data.total_pages
            })
        })
        .catch(error => {
            console.log(error)
        })
    }
    handleSearch (e) {
        this.setState({
            search: e.target.value
        })
        this.getSearch ()
    }

    onToggleFocus(){
        this.setState({
            isFocused: !this.state.isFocused
        })
    }

    render () {
        return (
            <div className="search-section">
                <div className="custom-search-wrapper">
                    <form className={'form-inline' + ' ' + (this.state.isFocused ? 'search-button-visible' : '')}>
                        <div className="form-search-combination">
                            <i className="fas fa-search"></i>
                            <input
                                id="searchGlobal" 
                                className="form-control"
                                type="search" 
                                type="search" placeholder="Search"
                                onBlur={this.onToggleFocus} 
                                onFocus={this.onToggleFocus} 
                                onChange={this.handleSearch}
                                value = {this.state.search}
                            />
                        </div>
                        {/* <button className="btn my-2 my-sm-0" type="button">Search</button> */}
                        <div className="search-result-overlay"></div>
                        <div className="search-result-section">
                            {/* This is default text, which should visible when focused on the search */}
                            {/* <ul className="searched-lists">
                                <li>
                                    <p className="d-flex align-items-center justify-content-center">
                                        Search for a user or post
                                    </p>
                                </li>
                            </ul> */}
                            <ul className="searched-lists searchlist-user">
                                <li>
                                    <a className="searched-list" href="javascript:void(0);">
                                        <span><strong className="matched">Ven</strong>om</span>
                                        <small>English</small>
                                    </a>
                                </li>
                                <li>
                                    <a className="searched-list" href="javascript:void(0);">
                                        <span><strong className="matched">Ven</strong>nala</span>
                                        <small>Telugu</small>
                                    </a>
                                </li>
                                <li className="d-none d-md-block">
                                    <a className="searched-list" href="javascript:void(0);">
                                        <span><strong className="matched">Ven</strong>nice</span>
                                        <small>English</small>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
export default Search