// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Counter.css';
import routes from '../constants/routes';
import ListView, { ListViewProps } from "react-uwp/ListView";
import ProgressRing from "react-uwp/ProgressRing";

type Props = {
  increment: () => void,
  incrementIfOdd: () => void,
  incrementAsync: () => void,
  decrement: () => void,
  getPackageStats: () => void,
  counter: any
};

export default class Counter extends Component<Props> {
  props: Props;
  todos: object;

  componentWillMount(){
    console.log(this.props);
    this.props.getPackageStats(this.props.package);
  }

  render() {
    let todos;
    let Temp='';
    let Content;
    const {
      increment,
      incrementIfOdd,
      incrementAsync,
      decrement,
      getDependencies,
      counter
    } = this.props;

    if(counter.size){
        Temp = (<div className="hello">sdafasfasf{counter.size}</div>);
        
    }else{
        Temp = (<a>Rate limit excedeed</a>)
    }
    
    if(counter.message){
        return (
            <div>
                <p><b>{counter.message}</b></p>
            </div>
        )
    }else{
        if(counter.size){
            Content =  (
                <div>
                <div className={styles.backButton} data-tid="backButton">

                <Link to={routes.COUNTER}>
                  <i className="fa fa-arrow-left fa-3x" />
                </Link>
                </div>
                <div className={styles.container}>
                  <p>Size: {counter.size}</p>
                  <p>Watcheers_count: {counter.watchers_count}</p>
                  <p>subscribers_count:{counter.subscribers_count}</p>
                  <p>Open Isssues:{counter.open_issues}</p>
                  <p>Forks count:{counter.forks_count}</p>          
                </div>
                </div>
            )
        }else{
            Content = (
                <div className={styles.container}>
                <ProgressRing size={75} dotsNumber={10} />
                </div>
            )
        }
        return Content;
    }
    
    
  }
}
