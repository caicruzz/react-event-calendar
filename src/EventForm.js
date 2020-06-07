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
                                    label="Title"
                                    type="text"
                                    classes='EventFormInput'
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Assignee"
                                    type="text"
                                    fullWidth={true}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth={true}>
                                    <InputLabel id='color-dropdown'>Color</InputLabel>
                                    <Select labelId='color-dropdown'>
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
                                        label="Start"
                                        format="MM/dd/yyyy"
                                        value={ this.props.selectedDate }
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                        onChange={(evt) => this.props.onDateChanged('selectedDate', evt) }
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <KeyboardTimePicker
                                        label="Start Time"
                                        value={ this.props.selectedDate }
                                        onChange={(evt) => this.props.onDateChanged('selectedDate', evt) }
                                        KeyboardButtonProps={{
                                            'aria-label': 'change time',
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <KeyboardDatePicker
                                        label="End"
                                        format="MM/dd/yyyy"
                                        value={ this.props.defaultEndDate }
                                        onChange={(evt) => this.props.onDateChanged('defaultEndDate', evt) }
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <KeyboardTimePicker
                                        label="End Time"
                                        value={ this.props.defaultEndDate }
                                        onChange={(evt) => this.props.onDateChanged('defaultEndDate', evt) }
                                        KeyboardButtonProps={{
                                            'aria-label': 'change time',
                                        }}
                                    />
                                </Grid>
                            </MuiPickersUtilsProvider>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" variant='contained'>Add</Button>
                        <Button color="secondary" variant='contained' startIcon={<icons.Delete />}>Delete</Button>
                        <Button onClick={ this.props.closeForm } color="primary" variant='contained'>Close</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default EventForm;
