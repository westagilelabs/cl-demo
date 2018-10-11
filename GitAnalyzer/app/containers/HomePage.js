// @flow
import React, { Component } from 'react';
import Home from '../components/Home';
import GithubScreen from '../components/GithubScreen';

type Props = {};

export default class HomePage extends Component<Props> {
  props: Props;

  render() {
    return <GithubScreen />;
  }
}
