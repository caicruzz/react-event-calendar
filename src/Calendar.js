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
            calendarEvents: [{ title: 'Event Now', start: new Date() }],
            isEventFormOpen: false,
            selectedStartDate: new Date(),
            calendarApi: null,
            isFloatingMenuVisible: true,
            isGotoDateFormOpen: false,
            defaultEndDate: null
        };

        this.getCurrentViewCalendarEvents = this.getCurrentViewCalendarEvents.bind(this);
        this.toggleFloatingMenu = this.toggleFloatingMenu.bind(this);
        this.toggleGoToDateForm = this.toggleGoToDateForm.bind(this);
        this.goToPreviousMonth = this.goToPreviousMonth.bind(this);
        this.addCalendarEvent = this.addCalendarEvent.bind(this);
        this.handleDateClick = this.handleDateClick.bind(this);
        this.closeEventForm = this.closeEventForm.bind(this);
        this.goToNextMonth = this.goToNextMonth.bind(this);
        this.onDateChanged = this.onDateChanged.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.goToToday = this.goToToday.bind(this);
    }

    handleDateClick(evt) {
        const selectedStartDate = evt.date
        const defaultEndDate = new Date(
            selectedStartDate.getFullYear(),
            selectedStartDate.getMonth(),
            selectedStartDate.getDate() + 1);

        this.setState({
            isEventFormOpen: !this.state.isEventFormOpen,
            selectedStartDate,
            defaultEndDate
        });
    }

    componentDidMount() {
        const calendarApi = this.props.calendarComponentRef.current.getApi();
        this.setState({ calendarApi }, this.getCurrentViewCalendarEvents);
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
        DataService.post(`${this.props.baseUrl}`, calendarEvent)
            .then(result => {
                this.setState(
                    (state) => ({ calendarEvents: [...state.calendarEvents, result]}),
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
                        dateClick={ this.handleDateClick }
                    />
                    <EventForm
                        end={ this.state.defaultEndDate }
                        selectedStartDate={ this.state.selectedStartDate }
                        onDateChanged={ this.onDateChanged }
                        open={ this.state.isEventFormOpen }
                        closeForm={ this.closeEventForm }
                        colors={ this.props.colors }
                        addCalendarEvent={ this.addCalendarEvent }
                    />
                </div>
                <div className='floating-menu'>
                    <Fab
                        color="secondary"
                        aria-label="go to today"
                        onClick={ this.goToToday }
                        className={ this.state.isFloatingMenuVisible ? 'visible-button' : 'invisible-button'}>
                        Today
                    </Fab>
                    <Fab
                        color="secondary"
                        aria-label="go to previous month"
                        onClick={ this.goToPreviousMonth }
                        className={ this.state.isFloatingMenuVisible ? 'visible-button' : 'invisible-button'}>
                        <icons.ArrowBack />
                    </Fab>
                    <Fab
                        color="secondary"
                        aria-label="go to next month"
                        onClick={ this.goToNextMonth }
                        className={ this.state.isFloatingMenuVisible ? 'visible-button' : 'invisible-button'}>
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
