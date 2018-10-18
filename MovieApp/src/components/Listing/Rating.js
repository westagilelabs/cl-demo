import React, { Component } from 'react';
import { Collapse, Button, CardBody, Card, Input,
    Form, FormGroup, Alert
} from 'reactstrap';

class Rating extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            collapse: false ,
            input : '',
            alert : false
        }
        this.toggle = this.toggle.bind(this);
        this.handleInput = this.handleInput.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.onDismiss = this.onDismiss.bind(this);
    }

    toggle() {
        this.setState({ 
            collapse: !this.state.collapse 
        });
    }

    handleInput (e) {
        if (e.target.value.length <= 2 && e.target.value <= 10) {
            this.setState ({
                input : e.target.value
            })
        }
    }
    handleSubmit (e) {
        e.preventDefault ()
        this.props.setRating(this.state.input)
        this.setState ({
            input : '',
            collapse : !this.state.collapse,
            alert : true
        })
    }

    onDismiss() {
        this.setState({ 
            alert : false 
        });
    }

    render() {
        return (
        <div className="rating-wrapper">
            <button onClick={this.toggle} style={{ marginBottom: '1rem' }}>Click to Rate</button>
            <Collapse isOpen={this.state.collapse}>
            <Card>
                <CardBody>
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                    <Input
                        min={0} 
                        placeholder="Rate on 10"
                        type="number"
                        value = {this.state.input}
                        onChange = {this.handleInput}
                    />
                        </FormGroup>
                    </Form>
                </CardBody>
            </Card>
            </Collapse>
            <Alert color="primary" isOpen = {this.state.alert}  toggle={this.onDismiss}>
                Your rating has been submited
            </Alert>
        </div>
        );
    }
}

export default Rating;