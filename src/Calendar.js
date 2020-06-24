import React, { Component } from 'react';
// FullCalendar
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';

// Material UI
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import * as icons from '@material-ui/icons';
import Fab from '@material-ui/core/Fab';

// 3rd party
import { DatePickerCalendar } from 'react-nice-dates';
import { enUS } from 'date-fns/locale';
import 'react-nice-dates/build/style.css';

import DataService from './DataService';
import EventForm from './EventForm';
import './calendar.scss';

class Calendar extends Component {

    static defaultProps = {
        calendarComponentRef: React.createRef(),
        colors: ['crimson', 'blue', 'orange', 'green', 'pink', 'purple'],
        baseUrl: 'http://localhost:3001/api/events'
    };

    constructor(props) {
        super(props);
        this.state = {
            calendarWeekends: true,
            calendarEvents: [],
            isEventFormOpen: false,
            selectedStartDate: new Date(),
            calendarApi: null,
            isFloatingMenuVisible: true,
            isGotoDateFormOpen: false,
            defaultEndDate: null,
            isEventFormInEditMode: false,
            eventToEdit: null
        };

        this.getCurrentViewCalendarEvents = this.getCurrentViewCalendarEvents.bind(this);
        this.deleteCalendarEvent = this.deleteCalendarEvent.bind(this);
        this.toggleFloatingMenu = this.toggleFloatingMenu.bind(this);
        this.toggleGoToDateForm = this.toggleGoToDateForm.bind(this);
        this.goToPreviousMonth = this.goToPreviousMonth.bind(this);
        this.addCalendarEvent = this.addCalendarEvent.bind(this);
        this.closeEventForm = this.closeEventForm.bind(this);
        this.goToNextMonth = this.goToNextMonth.bind(this);
        this.onDateChanged = this.onDateChanged.bind(this);
        this.onEventClick = this.onEventClick.bind(this);
        this.onDateClick = this.onDateClick.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.goToToday = this.goToToday.bind(this);
    }

    onDateClick(evt) {
        const selectedStartDate = evt.date
        const defaultEndDate = new Date(
            selectedStartDate.getFullYear(),
            selectedStartDate.getMonth(),
            selectedStartDate.getDate() + 1);

        this.setState({
            isEventFormInEditMode: false,
            isEventFormOpen: true,
            eventToEdit: null,
            selectedStartDate,
            defaultEndDate
        });
    }

    componentDidMount() {
        const calendarApi = this.props.calendarComponentRef.current.getApi();
        this.setState({ calendarApi }, this.getCurrentViewCalendarEvents);
    }

    onEventClick(evt) {
        const { title, start, end, backgroundColor: color } = evt.event;
        const {_id, assignedTo } = evt.event.extendedProps;
        const eventToEdit = {_id, assignedTo, title, start, end, color};
        this.setState({ isEventFormOpen: true, isEventFormInEditMode: true, eventToEdit })
    }

    onDateChanged(statePropName, newDate) {
        this.setState({ [statePropName]: newDate})
    }

    closeEventForm() {
        this.setState({ isEventFormOpen: false});
    }

    goToToday() {
        this.state.calendarApi.gotoDate(new Date());
        this.getCurrentViewCalendarEvents();
    }

    goToNextMonth() {
        this.state.calendarApi.next();
        this.getCurrentViewCalendarEvents();
    }

    getCurrentViewCalendarEvents() {
        const calendarView = this.state.calendarApi.view;
        const params = { start: calendarView.activeStart, end: calendarView.activeEnd }
        DataService.get(`${this.props.baseUrl}/range`, params)
            .then(result => this.setState({ calendarEvents: result }));
    }

    toggleGoToDateForm() {
        this.setState(state => ({ isGotoDateFormOpen: !state.isGotoDateFormOpen }))
    }

    goToPreviousMonth() {
        this.state.calendarApi.prev();
        this.getCurrentViewCalendarEvents();
    }

    changeDate(e) {
        this.state.calendarApi.gotoDate(e);
        this.setState({ isGotoDateFormOpen: false });
        this.getCurrentViewCalendarEvents();
    }

    toggleFloatingMenu() {
        this.setState(state => ({ isFloatingMenuVisible: !state.isFloatingMenuVisible}));
    }

    addCalendarEvent(calendarEvent) {
        if (!calendarEvent.hasOwnProperty('_id')) {
            DataService.post(`${this.props.baseUrl}`, calendarEvent)
                .then(result => {
                    this.setState(
                        (state) => ({ calendarEvents: [...state.calendarEvents, result]}),
                        this.closeEventForm
                    );
                });
        } else {
            DataService.patch(`${this.props.baseUrl}/${calendarEvent._id}`, calendarEvent)
                .then(result => {
                    const filteredEvents = this.state.calendarEvents.filter(ce => ce._id !== result._id);
                    this.setState(
                        {calendarEvents: [...filteredEvents, result]},
                        this.closeEventForm
                    );
                });
        }
    }

    deleteCalendarEvent(_id) {
        DataService.delete(`${this.props.baseUrl}/${_id}`)
            .then(result => {
                const filteredEvents = this.state.calendarEvents.filter(ce => ce._id !== _id);
                this.setState(
                    { calendarEvents: filteredEvents },
                        this.closeEventForm
                    );
            });
    }

    render() {
        return (
            <div>
                <div className='Calendar'>
                    <FullCalendar
                        defaultView="dayGridMonth"
                        defaultDate={ new Date() }
                        header={{
                            left: '',
                            center: 'title',
                            right: ''
                        }}
                        plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
                        ref={ this.props.calendarComponentRef }
                        weekends={ this.state.calendarWeekends }
                        events={ this.state.calendarEvents }
                        dateClick={ this.onDateClick }
                        eventClick={ this.onEventClick }
                    />
                    {
                        this.state.isEventFormOpen &&
                        <EventForm
                            selectedStartDate={ this.state.selectedStartDate }
                            isEditMode={ this.state.isEventFormInEditMode }
                            addCalendarEvent={ this.addCalendarEvent }
                            deleteCalendarEvent={ this.deleteCalendarEvent }
                            eventToEdit={ this.state.eventToEdit }
                            onDateChanged={ this.onDateChanged }
                            open={ this.state.isEventFormOpen }
                            end={ this.state.defaultEndDate }
                            closeForm={ this.closeEventForm }
                            colors={ this.props.colors }
                        />
                    }
                </div>
                <div className='floating-menu'>
                    <Fab
                        className={ this.state.isFloatingMenuVisible ? 'visible-button' : 'invisible-button'}
                        onClick={ this.goToToday }
                        aria-label="go to today"
                        color="secondary">
                        Today
                    </Fab>
                    <Fab
                        className={ this.state.isFloatingMenuVisible ? 'visible-button' : 'invisible-button'}
                        onClick={ this.goToPreviousMonth }
                        aria-label="go to previous month"
                        color="secondary">
                        <icons.ArrowBack />
                    </Fab>
                    <Fab
                        className={ this.state.isFloatingMenuVisible ? 'visible-button' : 'invisible-button'}
                        onClick={ this.goToNextMonth }
                        aria-label="go to next month"
                        color="secondary">
                        <icons.ArrowForward />
                    </Fab>
                    <Fab
                        color="secondary"
                        aria-label="select a date"
                        onClick={ this.toggleGoToDateForm }
                        className={ this.state.isFloatingMenuVisible ? 'visible-button' : 'invisible-button'}>
                        <icons.DateRangeTwoTone />
                    </Fab>
                    <Fab
                        color="secondary"
                        aria-label="expand floating menu"
                        className=''
                        onClick={ this.toggleFloatingMenu }>
                        { this.state.isFloatingMenuVisible ? <icons.KeyboardArrowDown/> : <icons.KeyboardArrowUp />}
                    </Fab>
                </div>
                <Dialog open={ this.state.isGotoDateFormOpen } fullWidth={true}>
                    <DialogContent>
                        <DialogTitle>Go to:</DialogTitle>
                        <DatePickerCalendar locale={ enUS } onDateChange={(e) => this.changeDate(e)}/>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }
}

export default Calendar;
