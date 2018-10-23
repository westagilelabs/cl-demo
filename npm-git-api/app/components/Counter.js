// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Counter.css';
import routes from '../constants/routes';
import ListView, { ListViewProps } from "react-uwp/ListView";
import ProgressRing from 'react-uwp/ProgressRing';


type Props = {
  increment: () => void,
  incrementIfOdd: () => void,
  incrementAsync: () => void,
  decrement: () => void,
  getDependencies: () => void,
  counter: any
};

export default class Counter extends Component<Props> {
  props: Props;
  todos: object;

  componentWillMount(){
    this.props.getDependencies();
  }

  render() {
    let todos;
    const {
      increment,
      incrementIfOdd,
      incrementAsync,
      decrement,
      getDependencies,
      counter
    } = this.props;
    if(typeof counter === 'object'){
      todos = counter;
    }

    if(todos && todos.counter){
      let temp = todos.counter.map(item => {
        return <li><a href={'#/package/'+item}>{item}</a></li>
      });

        return (
            <div>
            <div className={styles.backButton} data-tid="backButton">
              <Link to={routes.HOME}>
                <i className="fa fa-arrow-left fa-3x" />
              </Link>
            </div>
            <div className={styles.middleContent} data-tid="middleContent">
            <h4> All dependencies</h4> <br/>
              <ListView listSource={temp}>
              </ListView>
            </div>
            </div>
        )
    }else{
      return (
         <ProgressRing size={75} dotsNumber={10} />
      );
    }
    
  }
}
