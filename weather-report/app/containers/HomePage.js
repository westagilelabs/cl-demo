// @flow
import React, { Component } from 'react';
import Store from  'electron-store';
import Home from '../components/Home';

const store  = new Store();
type Props = {};

export default class HomePage extends Component<Props> {
  props: Props;

  render() {
    store.set('token',"skjdfhskdjfh");
    const token = store.get('token')
    console.log("token ==>",token);
    return <Home />;
  }
}
