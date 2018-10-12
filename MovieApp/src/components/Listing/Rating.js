import React, { Component } from 'react';
import { Collapse, Button, CardBody, Card, Input } from 'reactstrap';

class Rating extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            collapse: false 
        }
        this.toggle = this.toggle.bind(this);
        this.handleInput = this.handleInput.bind(this)
    }

    toggle() {
        this.setState({ 
            collapse: !this.state.collapse 
        });
    }

    handleInput (e) {
        this.props.setRating(e.target.value)
        this.setState ({
            collapse : !this.state.collapse
        })
    }

    render() {
        return (
        <div>
            <Button color="primary" onClick={this.toggle} style={{ marginBottom: '1rem' }}>Click to Rate</Button>
            <Collapse isOpen={this.state.collapse}>
            <Card>
                <CardBody>
                    <Input 
                        placeholder="Rate on 10"
                        type="number"
                        onChange = {this.handleInput}
                    />
                </CardBody>
            </Card>
            </Collapse>
        </div>
        );
    }
}

export default Rating;