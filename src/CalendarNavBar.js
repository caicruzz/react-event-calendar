import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import * as icons from '@material-ui/icons';
import Calendar from './Calendar';
import './CalendarNavBar.css';

class CalendarNavBar extends Component {

    static defaultProps = {
        options: { year: 'numeric', month: 'short' }
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedDate: new Date('12-02-2020')
        }
    }

    render() {
        return(
            <div className='CalendarNavBar'>
                <IconButton color="primary" aria-label="select a date">
                    <icons.DateRangeTwoTone />
                </IconButton>
                <h1 className='title'>
                    { this.state.selectedDate.toLocaleDateString('en-US', this.props.options) }
                </h1>
                <div className='left-nav'>
                    <Button variant='contained' color='primary'>Today</Button>
                    <IconButton>
                        <icons.ArrowBack />
                    </IconButton>
                    <IconButton>
                        <icons.ArrowForward />
                    </IconButton>
                </div>
                <Calendar selectedDate={ this.state.selectedDate }/>
            </div>
        );
    }
}

export default CalendarNavBar;
