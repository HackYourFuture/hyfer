import React, { Fragment, Component } from 'react';
import {
  Dialog, DialogContentText, DialogTitle,
  DialogContent, Button, TextField,
  FormControl, DialogActions,
} from '@material-ui/core';
import classes from './addClassModal.css';
import moment from 'moment';
import { inject, observer } from 'mobx-react';

@inject('timeLineStore')
@observer
export default class AddClassModal extends Component {
  state = {
    classNumber: '',
    starting_date: '',
  };

  handleChangeClassNameInput = e => {
    const { value } = e.target;
    if (!isNaN(value)) {
      this.setState({
        classNumber: value,
      });
    } else {
      // this.refs.classNrInput.value = this.state.classNumber;
      this.setState({
        errorMessage: 'Please provide only the number of the new class',
      });
      return;
    }
    const { starting_date } = this.state;
    if (value && starting_date) {
      this.setState({
        errorMessage: '',
      });
    }
  };

  handleChangeStartingDateInput = e => {
    // if all valid remove weird error message
    const { value } = e.target;
    if (!value) {
      this.setState({
        errorMessage: 'Please provide a valid starting date for the class',
      });
    }
    const { classNumber } = this.state;
    if (classNumber && value) {
      this.setState({
        errorMessage: '',
      });
    }
    const selectedDate = moment(value, 'YYYY-MM-DD');
    const daysDif = 7 - selectedDate.day(); // till sunday
    selectedDate.add(daysDif, 'days'); // keep going back in the week until it's a sunday
    this.setState({
      starting_date: selectedDate.format('YYYY-MM-DD'),
    });
  };

  addNewClass = () => {
    const { classNumber, starting_date } = this.state;
    if (!classNumber || !starting_date) {
      this.setState({
        errorMessage: 'Please make sure to fill all the inputs',
      });
      return;
    }
    this.props.timeLineStore.addNewClass(`Class ${classNumber}`, starting_date)
      .then(() => {
        this.props.onClose();
        this.props.timeLineStore.fetchItems();
      })
      .catch((error) => {
        const e = new Error(error);
        this.setState({
          errorMessage: e.message,
        });
      });
  };

  render() {
    return (
      <Fragment>
        <Dialog
          title="Add a new class"
          open={this.props.open}
          onClose={this.props.onClose}
        >
          <DialogTitle id="form-dialog-title">Add a Class</DialogTitle>
          <DialogContent>
            <form>
              <FormControl className={classes.formControl}>
                <DialogContentText>
                  Class Name
            </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Provide only a class number"
                  type="number"
                  value={this.state.classNumber}
                  onChange={this.handleChangeClassNameInput}
                  fullWidth
                />
                <br />
                <DialogContentText>
                  Start Date of Module
                    </DialogContentText>
                <input
                  id="startingDate"
                  type="date"
                  min={new moment().format('YYYY-MM-DD')}
                  value={this.state.starting_date}
                  onChange={this.handleChangeStartingDateInput}
                />
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              color="inherit"
              onClick={this.props.onClose}
              aria-label="Close"
            >
              Cancel
            </Button>
            <Button
              onClick={this.addNewClass}
              color="inherit"
            >
              Add
              </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}
