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

class EventForm extends Component {
    render() {
        return(
            <div>
                <Dialog open={ this.props.open }>
                    <DialogTitle id="form-dialog-title">Add Event</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="title"
                            label="title"
                            type="text"
                        />
                        <TextField
                            margin="dense"
                            id="assignee"
                            label="assignee"
                            type="text"
                        />
                        <FormControl>
                            <InputLabel id='color-dropdown'>Color</InputLabel>
                            <Select labelId='color-dropdown'>
                                <MenuItem>Crimson</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button>Close</Button>
                        <Button>Add</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default EventForm;
