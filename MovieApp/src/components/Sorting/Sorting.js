import React, {Component} from 'react';
import { Input } from 'reactstrap';

export default class Example extends Component {
  render() {
    return (
      <div>
        <Input type="select" name="select" id="exampleSelect">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </Input>
      </div>
    );
  }
}