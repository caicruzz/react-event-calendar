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
        this.state = {
            title: '',
            assignedTo: '',
            color: 'crimson',
            start: this.props.selectedStartDate,
            end: this.props.end,
        }

        this.handleOnDateChange = this.handleOnDateChange.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    handleOnChange(evt) {
        this.setState({ [evt.target.name]: evt.target.value});
    }

    handleOnDateChange(statePropName, newDate) {
        this.setState({ [statePropName]: newDate });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props === prevProps) return;

        const start = this.props.selectedStartDate;
        const end = this.props.end;
        this.setState({ start, end });
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
                                    value={ this.state.title }
                                    onChange={ this.handleOnChange }
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label='Assignee'
                                    type='text'
                                    name='assignedTo'
                                    fullWidth={true}
                                    value={ this.state.assignedTo }
                                    onChange={ this.handleOnChange }
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth={true}>
                                    <InputLabel id='color-dropdown'>Color</InputLabel>
                                    <Select
                                        labelId='color-dropdown'
                                        value={ this.state.color }
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
                                        value={ this.state.start }
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
                                        value={ this.state.start }
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
                                        value={ this.state.end }
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
                                        value={ this.state.end }
                                        onChange={ (newDate) => this.handleOnDateChange('end', newDate) }
                                    />
                                </Grid>
                                </MuiPickersUtilsProvider>
                            </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={ () => this.props.addCalendarEvent(this.state) } color='primary' variant='contained'>Add</Button>
                        <Button color='secondary' variant='contained' startIcon={<icons.Delete />}>Delete</Button>
                        <Button onClick={ this.props.closeForm } color='primary' variant='contained'>Close</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default EventForm;
