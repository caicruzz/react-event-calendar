import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import EventForm from './EventForm';

import './calendar.scss';

class Calendar extends Component {

    static defaultProps = {
        calendarComponentRef: React.createRef()
    };

    constructor(props) {
        super(props);
        this.state = {
            calendarWeekends: true,
            calendarEvents: [{ title: 'Event Now', start: new Date() }],
            isFormOpen: false
        };

        this.handleDateClick = this.handleDateClick.bind(this);
    }

    handleDateClick(evt) {
        console.log(evt);
        this.setState({ isFormOpen: !this.state.isFormOpen });
    }

    render() {
        return (
            <div>
                <FullCalendar
                    defaultView="dayGridMonth"
                    defaultDate={ this.props.selectedDate }
                    header={{
                        left: '',
                        center: '',
                        right: ''
                    }}
                    plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
                    ref={ this.props.calendarComponentRef }
                    weekends={ this.state.calendarWeekends }
                    events={ this.state.calendarEvents }
                    dateClick={ this.handleDateClick }
                />
                <EventForm open={ this.state.isFormOpen }/>
            </div>
        )
    }
}

export default Calendar;
