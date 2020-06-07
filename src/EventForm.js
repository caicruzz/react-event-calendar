import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import './EventForm.css';

class EventForm extends Component {
    render() {
        return(
            <div>
                <Dialog open={ this.props.open } fullWidth={ true }>
                    <DialogTitle id="form-dialog-title">Add Event</DialogTitle>
                    <DialogContent>
                        <div id='title'>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="title"
                                type="text"
                                classes='EventFormInput'
                            />
                        </div>
                        <div id='assignee'>
                            <TextField
                                margin="dense"
                                label="assignee"
                                type="text"
                                fullWidth={true}
                            />
                        </div>
                        <div id='event-color'>
                            <FormControl fullWidth={true}>
                                <InputLabel id='color-dropdown'>Color</InputLabel>
                                <Select labelId='color-dropdown'>
                                    <MenuItem>Crimson</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div id='start-date'>
                            <TextField
                                margin="dense"
                                label="assignee"
                                type="datetime-local"
                                fullWidth={true}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={ this.props.closeForm }>Close</Button>
                        <Button>Add</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default EventForm;
