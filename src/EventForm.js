import React, { Component } from 'react';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns';
import * as icons from '@material-ui/icons';
import Grid from '@material-ui/core/Grid';
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
    KeyboardTimePicker
} from '@material-ui/pickers';

import './EventForm.css';

class EventForm extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.isEditMode
            ? this.generateStateBasedOnEvent(this.props.eventToEdit)
            : this.generateCleanState();

        this.handleDeleteCalendarEvent = this.handleDeleteCalendarEvent.bind(this);
        this.handleOnDateChange = this.handleOnDateChange.bind(this);
        this.getEmptyFormFields = this.getEmptyFormFields.bind(this);
        this.handleOnSubmitForm = this.handleOnSubmitForm.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    generateCleanState() {
        return {
            fields: {
                title: '',
                assignedTo: '',
                color: 'crimson',
                start: this.props.selectedStartDate,
                end: this.props.end
            },
            fieldErrors: [],
            isDeleteButtonEnabled: false,
            isFormValid: false
        }
    }

    generateStateBasedOnEvent(event) {
        return {
            fields: {
                ...event
            },
            fieldErrors: [],
            isDeleteButtonEnabled: false,
            isFormValid: false
        }
    }

    handleOnChange(evt) {
        let fields = {...this.state.fields};
        fields[evt.target.name] = evt.target.value;
        this.setState({ fields }, this.validateForm);
    }

    handleOnDateChange(statePropName, newDate) {
        let fields = {...this.state.fields};
        fields[statePropName] = newDate;
        this.setState({ fields }, this.validateForm);
    }

    handleDeleteCalendarEvent() {
        const _id = this.state.fields._id;
        this.props.deleteCalendarEvent(_id);
    }

    isFieldEmpty(field) {
        if (typeof field === 'string') {
            return field.trim() === '';
        } else {
            return field === null || field === undefined;
        }
    }

    validateForm() {
        const { start, end } = this.state.fields;
        const emptyFormFields = this.getEmptyFormFields()
        let fieldErrors = [];
        let isFormValid = false;

        if (!this.isFieldEmpty(end) && !this.isFieldEmpty(start) && end <= start) {
            fieldErrors = ['End date and time must be after start date and time.'];
        }

        const emptyFieldsFormErrorMessage = emptyFormFields.map(eff => `${eff} is required.`)
        fieldErrors = [...fieldErrors, ...emptyFieldsFormErrorMessage]

        if (fieldErrors.length === 0) isFormValid = true;

        this.setState({ fieldErrors, isFormValid });
    }

    getEmptyFormFields() {
        let emptyFields = [];

        for (const field in this.state.fields) {
            if (this.isFieldEmpty(this.state.fields[field])) {
                emptyFields.push(field);
            }
        }

        return emptyFields;
    }

    async handleOnSubmitForm() {
        await this.validateForm();

        if (this.state.isFormValid) {
            this.props.addCalendarEvent(this.state.fields);
        }
    }

    render() {
        return(
            <div>
                <Dialog open={ this.props.open } fullWidth={ true }>
                    <DialogTitle>Add Event</DialogTitle>
                    <DialogContent className='EventFormDialogContent'>
                        <Grid container spacing={3} className='EventFormGrid'>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    autoFocus
                                    label='Title'
                                    name='title'
                                    type='text'
                                    value={ this.state.fields.title }
                                    onChange={ this.handleOnChange }
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label='Assignee'
                                    type='text'
                                    name='assignedTo'
                                    fullWidth={true}
                                    value={ this.state.fields.assignedTo }
                                    onChange={ this.handleOnChange }
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth={true}>
                                    <InputLabel id='color-dropdown'>Color</InputLabel>
                                    <Select
                                        labelId='color-dropdown'
                                        value={ this.state.fields.color }
                                        onChange={ this.handleOnChange }
                                        name='color'
                                    >
                                        { this.props.colors.map(c => <MenuItem
                                            key={c}
                                            value={c}
                                        >{c}</MenuItem>) }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid item xs={12} md={6}>
                                    <KeyboardDatePicker
                                        label='Start'
                                        format='MM/dd/yyyy'
                                        name='start'
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                        value={ this.state.fields.start }
                                        onChange={ (newDate) => this.handleOnDateChange('start', newDate) }
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <KeyboardTimePicker
                                        label='Start Time'
                                        name='start'
                                        KeyboardButtonProps={{
                                            'aria-label': 'change time',
                                        }}
                                        value={ this.state.fields.start }
                                        onChange={ (newDate) => this.handleOnDateChange('start', newDate) }
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <KeyboardDatePicker
                                        label='End'
                                        name='end'
                                        format='MM/dd/yyyy'
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                        value={ this.state.fields.end }
                                        onChange={ (newDate) => this.handleOnDateChange('end', newDate) }
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <KeyboardTimePicker
                                        label='End Time'
                                        name='end'
                                        KeyboardButtonProps={{
                                            'aria-label': 'change time',
                                        }}
                                        value={ this.state.fields.end }
                                        onChange={ (newDate) => this.handleOnDateChange('end', newDate) }
                                    />
                                </Grid>
                                    <Grid item xs={12} className='FormErrors'>
                                        <ul>
                                            {this.state.fieldErrors.map((fe, index) => <li key={index}><span>{fe}</span></li>)}
                                        </ul>
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={ this.handleOnSubmitForm }
                            variant='contained'
                            color='primary'
                        >
                            { this.props.isEditMode ? 'Edit': 'Add'}
                        </Button>
                        <Button
                            disabled={ !this.props.isEditMode }
                            startIcon={ <icons.Delete /> }
                            onClick={ this.handleDeleteCalendarEvent }
                            variant='contained'
                            color='secondary'
                        >
                            Delete
                        </Button>
                        <Button
                            onClick={ this.props.closeForm }
                            variant='contained'
                            color='primary'
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default EventForm;
