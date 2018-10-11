import React, { Component } from 'react';
import './App.css';
import  HomePage  from './components/HomePage/HomePage';
import Search from './components/Search/Search';
import { 
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import MovieDetails from './components/Listing/MovieDetails';


class App extends Component {
  
  render() {
    return (
        <Router>
          <React.Fragment>
            <Switch>
            <Route path='/movie' component={MovieDetails}/>
            <Route  path='/' component={HomePage}/>
            </Switch>
          </React.Fragment>
        </Router>
    );
  }
}

export default App;
