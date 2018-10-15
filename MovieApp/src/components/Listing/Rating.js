import React, { Component } from 'react';
import { Collapse, Button, CardBody, Card, Input,
    Form, FormGroup
} from 'reactstrap';

class Rating extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            collapse: false ,
            input : ''
        }
        this.toggle = this.toggle.bind(this);
        this.handleInput = this.handleInput.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    toggle() {
        this.setState({ 
            collapse: !this.state.collapse 
        });
    }

    handleInput (e) {
        this.setState ({
            input : e.target.value
        })
    }
    handleSubmit () {
        this.props.setRating(this.state.input)
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
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                    <Input
                        min={0} 
                        placeholder="Rate on 10"
                        type="number"
                        onChange = {this.handleInput}
                    />
                        </FormGroup>
                    </Form>
                </CardBody>
            </Card>
            </Collapse>
        </div>
        );
    }
}

export default Rating;