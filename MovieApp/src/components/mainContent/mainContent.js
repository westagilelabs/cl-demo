import React, { Component } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import classnames from 'classnames';
import Listing from '../Listing/Listing';

class MainContent extends Component {

    constructor(props) {
        super(props);
    
        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1'
        };
    }
    
    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
            activeTab: tab
            });
        }
    }

    render() {
        return (
            <div className="main-content-section">
                <div className="sidebar-section">
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={() => { this.toggle('1'); }}
                            >
                                <i className="far fa-hand-spock"></i>
                                <span>Trending Movies</span>
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={() => { this.toggle('2'); }}
                            >   
                                <i className="far fa-star"></i>
                                <span>Top Rated</span>
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '3' })}
                                onClick={() => { this.toggle('3'); }}
                            >
                                <i className="fas fa-film"></i>
                                <span>Now Running</span>
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '4' })}
                                onClick={() => { this.toggle('4'); }}
                            >
                                <i className="fas fa-cloud-upload-alt"></i>
                                <span>Upcoming</span>
                            </NavLink>
                        </NavItem>
                    </Nav>
                </div>
                <div className="content-section">
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <Listing/>
                        </TabPane>
                        <TabPane tabId="2">
                            Hayyah!2
                        </TabPane>
                        <TabPane tabId="3">
                            Hayyah!3
                        </TabPane>
                        <TabPane tabId="4">
                            Hayyah!4
                        </TabPane>
                    </TabContent>
                </div>
            </div>
        )
    }
}

export default MainContent;