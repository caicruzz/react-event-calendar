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

import EventForm from './EventForm';
import './calendar.scss';

class Calendar extends Component {

    static defaultProps = {
        calendarComponentRef: React.createRef(),
        colors: ['crimson', 'orange', 'green', 'pink']
    };

    constructor(props) {
        super(props);
        this.state = {
            calendarWeekends: true,
            calendarEvents: [{ title: 'Event Now', start: new Date() }],
            isEventFormOpen: false,
            selectedDate: new Date(),
            calendarApi: null,
            isFloatingMenuVisible: true,
            isGotoDateFormOpen: false,
            defaultEndDate: null
        };

        this.toggleFloatingMenu = this.toggleFloatingMenu.bind(this);
        this.toggleGoToDateForm = this.toggleGoToDateForm.bind(this);
        this.onDateChanged = this.onDateChanged.bind(this);
        this.goToPreviousMonth = this.goToPreviousMonth.bind(this);
        this.handleDateClick = this.handleDateClick.bind(this);
        this.closeEventForm = this.closeEventForm.bind(this);
        this.goToNextMonth = this.goToNextMonth.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.goToToday = this.goToToday.bind(this);
    }

    handleDateClick(evt) {
        const selectedDate = evt.date
        const defaultEndDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate() + 1);
        this.setState({
            isEventFormOpen: !this.state.isEventFormOpen,
            selectedDate,
            defaultEndDate
        });
    }

    onDateChanged(statePropName, newDate) {
        console.log(newDate);
        this.setState({ [statePropName]: newDate})
    }

    closeEventForm() {
        this.setState({ isEventFormOpen: false});
    }

    componentDidMount() {
        const calendarApi = this.props.calendarComponentRef.current.getApi();
        this.setState({ calendarApi });
    }

    goToToday() {
        this.state.calendarApi.gotoDate(new Date());
    }

    goToNextMonth() {
        this.state.calendarApi.next();
    }

    toggleGoToDateForm() {
        this.setState(state => ({ isGotoDateFormOpen: !state.isGotoDateFormOpen }))
    }

    goToPreviousMonth() {
        this.state.calendarApi.prev();
    }

    changeDate(e) {
        this.state.calendarApi.gotoDate(e);
        this.setState({ isGotoDateFormOpen: false });
    }

    toggleFloatingMenu() {
        this.setState(state => ({ isFloatingMenuVisible: !state.isFloatingMenuVisible}));
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
                        defaultEndDate={ this.state.defaultEndDate }
                        selectedDate={ this.state.selectedDate }
                        onDateChanged={ this.onDateChanged }
                        open={ this.state.isEventFormOpen }
                        closeForm={ this.closeEventForm }
                        colors={ this.props.colors }
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
