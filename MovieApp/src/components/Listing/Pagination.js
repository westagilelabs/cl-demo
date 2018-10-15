import React, { Component } from 'react'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

class PaginationComp extends Component {
    constructor (props) {
        super (props)
        this.state = {
            pages : [],
            currentPage : this.props.page
        }
    }
    componentWillReceiveProps(newProps) {
        var array = []
        for (var i=1; i <= newProps.totalPages; i++) {
            array.push(i)
            this.setState ({
                pages : array
            })
        }
    }
    render () {
        return (
            <Pagination aria-label="Page navigation example">
                <PaginationItem disabled={this.state.currentPage <= 0}>
                    <PaginationLink
                        onClick={e => this.props.setPage(this.state.currentPage - 1)}
                        previous
                        href="#"
                    />
                </PaginationItem>
                {this.state.pages.map((e, i) => {
                    return <PaginationItem active={e === this.props.page} key={i}>
                        <PaginationLink onClick={() => {this.props.setPage(e)}}>
                            {e}
                        </PaginationLink>
                    </PaginationItem>
                })}
                <PaginationItem disabled={this.state.currentPage >= this.props.totalPages - 1}>
                    <PaginationLink
                        onClick={e => this.props.setPage(this.state.currentPage + 1)}
                        next
                        href="#"
                    />
                </PaginationItem>
            </Pagination>
        )
    }
} 
export default PaginationComp