import React, { Component } from 'react'
import Search from '../Search/Search';

export default class header extends Component {
    render() {
        return (
            <header className="navbar fixed-top header-section d-flex align-items-center justify-content-between  container-fluid">
                <div className="d-flex align-items-center">
                    <a className="navbar-brand-bars" href="javascript:void(0);">
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
                <Search/>
            </header>
        )
    }
}
