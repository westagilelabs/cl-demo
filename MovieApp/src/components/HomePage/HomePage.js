import React, { Component } from 'react'
import Header from '../header/header'
import MainContent from '../mainContent/mainContent'

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
            </div>
        )
    }
}
export default HomePage