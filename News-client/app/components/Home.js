// @flow
import React, { Component } from 'react';
import styles from './Home.css';
import axios from 'axios';
import { Box, SearchField, Toolbar } from 'react-desktop/macOs';
import { Route } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import classnames from 'classnames';
import { TabContent, TabPane, Nav, NavItem, NavLink, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { NewsList } from '../models';
import Banner from './Banner';

export default class Home extends Component {
  constructor(Props) {
    super(Props);
    this.state = {
      activeTab: '1',
      result: '',
      modal: false,
      news: [],
      headlines: [],
      startDate: moment(),
      searchKeywords: "",
    }
    this.toggle = this.toggle.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getNews = this.getNews.bind(this);
    this.getHeadlines = this.getHeadlines.bind(this);
    this.toggleModal = this.toggleModal.bind(this);

  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
    if (this.state.activeTab === 2) {
    this.getNews();
    }
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleChangeDate(date) {
    let dateVal = date
    this.setState (
      (state) => ({
        startDate: dateVal,
      }), 
      () => {
        this.getNews()
      }
    )
  }

  handleSelectChange = (event) => {
    let selectVal = event.target.value
    this.setState (
      (state) => ({
        result: selectVal,
      }), 
      () => {
        this.getNews()
      }
    )
  }
  componentDidUpdate(){
    console.log(this.state)
    console.log('componentDidUpdate');

    // this.getNews();
  }

  handleChange(e) {
    console.log('HandleChange')
    console.log(e.target.value)
    let val = e.target.value;
    this.setState (
      (state) => ({
        searchKeywords: val,
      }), 
      () => {
        this.getNews()
      }
    )
  }
 

  getNews() {

    let keywords = this.state.searchKeywords
    let date;
    if(this.state.startDate){
      date = this.state.startDate.format("YYYY-MM-DD") ;
    }
    let sortResult = this.state.result
    console.log(date, 'date ***');
    let params = {
      
    };
    
    if(keywords) {
       params['q'] = keywords
    } 
    if (date) {
        params['startDate'] = date
    }
    if (sortResult) {
        params['sortBy'] = sortResult
    } 
    axios.defaults.baseURL = 'https://newsapi.org/v2/everything';
    axios.defaults.headers.common['Authorization'] = 'e18bb330222541caab90fb31d7ed0547';
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    axios({
      method: "GET",
      url: "https://newsapi.org/v2/everything",
      params: params,
    }).then((res) => {
      
      let data = res.data.articles.map((desc) => {
        let article={};
        article.author = desc.author;
        article.source = desc.source['name'];
        article.title = desc.title;
        article.imageURL = desc.urlToImage;
        article.newsURL = desc.url;
        article.createdDate = desc.publishedAt.split("T")[0];
        return article;
      })

      this.setState({
        news: data
      })

    }).catch((err) => {
      console.log(err)
    });
  }

  getHeadlines() {
    axios.defaults.baseURL = 'https://newsapi.org/v2/top-headlines';
    axios.defaults.headers.common['Authorization'] = 'e18bb330222541caab90fb31d7ed0547';
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    axios({
      method: "GET",
      url: "https://newsapi.org/v2/top-headlines",
      params: {
        country: "us"
      }
    }).then((res) => {
      
      let data = res.data.articles.map((desc) => {
        let article={};
        article.author = desc.author;
        article.source = desc.source['name'];
        article.title = desc.title;
        article.imageURL = desc.urlToImage;
        article.newsURL = desc.url;
        article.createdDate = desc.publishedAt.split("T")[0];
        return article;
      })

      this.setState({
        headlines: data
      })

    }).catch((err) => {
      console.log(err)
    });
  }


  clearSearch() {
    this.setState (
      (state) => ({
        searchKeywords: "",
        startDate: ""
      }), 
      () => {
        this.getNews()
      }
    )
  }
  componentDidMount(){
    console.log('COmponentDidMount');
    this.getHeadlines();
  }

  
  
  render() {
    return (
      <div className={styles.container} data-tid="container">
      {/* {this.state.get ? this.getNews () : null} */}
      <Banner/>  
    <section className={styles.mainContainer}>   
     <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              Headlines
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              News
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
             
              <ul>
          {
            this.state.headlines.map((country, index) => {
                  return <li key={`country_${index}`}>
                  <section className={styles.newsWrapper}>
                     <a href={country.newsURL}>
                      <div className={styles.headlinesContainer}>
                            <div className={styles.leftNewsPanel}>
                              <p>
                                {country.title}
                              </p>
                              <p>
                                <span>{country.author}</span> <span className={styles.seperator}>|</span>
                                <span>{country.source}</span> <span className={styles.seperator}>|</span>
                                <span>{country.createdDate}</span>
                              </p>
                            </div>
                            <div className={styles.rightImagePanel}>
                              <img src={country.imageURL} />
                            </div>
                        </div>
                      </a>
                      <Button onClick={this.toggleModal}>Read More</Button>
                      <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={this.props.className}>
                        <ModalHeader toggle={this.toggleModal}>Modal title</ModalHeader>
                        <ModalBody>
                           <webview id="foo" src={country.newsURL}></webview>  
                           {/* <iframe src={country.newsURL} width="400px" height="400px"></iframe>                        */}
                        </ModalBody>
                        <ModalFooter>
                          <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                        </ModalFooter>
                      </Modal>
                  </section>
                  </li>
            })
          }
        </ul>
          </TabPane>
          <TabPane tabId="2">
             <section className={styles.navwrapper}>
               
                <div className={styles.searchContainer}>
                  <input type="text" placeholder="Search" value={this.state.searchKeywords} onChange={this.handleChange} />
                  <span className={styles.closeButton} onClick={this.clearSearch}>x</span>
                </div>
                <DatePicker
                  dateFormat="YYYY-MM-DD"
                  selected={this.state.startDate}
                  onChange={this.handleChangeDate}
                />
                  <select value={this.state.result} onChange={this.handleSelectChange}>
                    <option value="relevancy">Most relevant</option>
                    <option value="publishedAt">Most recent</option>
                    <option value="popularity">Most popular</option> 
                  </select> 
              </section>
              {this.state.news.length > 0 ?
                  <ul>
                  {
                    this.state.news.map((country, index) => {
                          return <li key={`country_${index}`}>
                          <section className={styles.newsWrapper}>
                            <a href={country.newsURL}>
                              <div className={styles.headlinesContainer}>
                                    <div className={styles.leftNewsPanel}>
                                      <p>
                                        {country.title}
                                      </p>
                                      <p>
                                        <span>{country.author}</span> <span className={styles.seperator}>|</span>
                                        <span>{country.source}</span> <span className={styles.seperator}>|</span>
                                        <span>{country.createdDate}</span>
                                      </p>
                                    </div>
                                    <div className={styles.rightImagePanel}>
                                      <img src={country.imageURL} />
                                    </div>
                                </div>
                              </a>
                          </section>
                          </li>
                    })
                  }
                 </ul>
                 : 
                 <p>Search for something to see News</p>}
              
          </TabPane>
        </TabContent>
       </section>
       
      </div>
    );
  }
}

