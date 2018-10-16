import React, { Component } from 'react'
import Search from '../Search/Search';
const isOnline = require('is-online')

export default class header extends Component {
    constructor (props) {
        super (props)
        this.state = {
            search : false
        }
    }
    componentDidMount () {
        isOnline()
        .then(online => {
            if(online) {
                this.setState ({
                    search : !this.state.search
                })
            } else {
                this.setState ({
                    search : this.state.search
                })
            }
        })
    }
    render() {
        return (
            <header className="navbar fixed-top header-section d-flex align-items-center justify-content-between  container-fluid">
                <div className="d-flex align-items-center">
                    <a className="navbar-brand-bars" href="/">
                        <i className="fa fa-bars"></i>
                    </a>
                    <div className="navbar-brand">
                        <span>
                            <small className="m">M</small>
                            <small className="o">o</small>
                            <small className="v">v</small>
                            <small className="i">i</small>
                            <small className="e">e</small>
                            <small className="z">z</small>
                        </span>
                    </div>
                </div>
                {this.state.search ? <Search/> : null }
            </header>
        )
    }
}
