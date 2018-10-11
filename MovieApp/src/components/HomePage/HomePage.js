import React, { Component } from 'react'
import Header from '../header/header'
import MainContent from '../mainContent/mainContent'
import Listing from '../Listing/Listing'

class HomePage extends Component {
    constructor (props) {
        super (props)
        this.state = {

        }
    }

    render () {
        return (
            <div className = "homepage">
                <Header/>
                <MainContent/>
                <Listing/>
            </div>
        )
    }
}
export default HomePage