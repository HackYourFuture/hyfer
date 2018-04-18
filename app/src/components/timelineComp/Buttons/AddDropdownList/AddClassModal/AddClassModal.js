import React, { Component } from 'react';
import Modal from '../../../../../Helpers/Modal/Modal';
import classes from './addClassModal.css';
import { timelineStore } from '../../../../../store/';
import moment from 'moment';

export default class AddClassModal extends Component {
  state = {
    classNumber: '',
    starting_date: '',
    errorMessage: ''
  };

  handleChangeClassNameInput = e => {
    const { value } = e.target;
    if (!isNaN(value)) {
      this.setState({ classNumber: value });
    } else {
      this.refs.classNrInput.value = this.state.classNumber;
      this.setState({
        errorMessage: 'Please provide only the number of the new class'
      });
      return;
    }
    const { starting_date } = this.state;
    if (value && starting_date) {
      this.setState({ errorMessage: '' });
    }
  };

  handleChangeStartingDateInput = e => {
    // if all valid remove weird error message
    const { value } = e.target;
    if (!value) {
      this.setState({
        errorMessage: 'Please provide a valid starting date for the class'
      });
    }
    const { classNumber } = this.state;
    if (classNumber && value) {
      this.setState({ errorMessage: '' });
    }
    const selectedDate = moment(value, 'YYYY-MM-DD');
    const daysDif = 7 - selectedDate.day(); // till sunday
    selectedDate.add(daysDif, 'days'); // keep going back in the week until it's a sunday
    this.setState({ starting_date: selectedDate.format('YYYY-MM-DD') });
  };

  addNewClass = () => {
    const { classNumber, starting_date } = this.state;

    if (!classNumber || !starting_date) {
      this.setState({
        errorMessage: 'Please make sure to fill all the inputs'
      });
      return;
    }

    timelineStore
      .addTheClass(`Class ${classNumber}`, starting_date)
      .then(res => {
        //Awesome got the response close the modal
        this.props.closeModal();
      })
      .catch(err => {
        console.log(err);
        this.setState({ errorMessage: 'There was a network error!' });
      });
  };
  render() {
    return (
      <Modal
        title="Add a new class"
        visible={this.props.isToggled}
        closeModal={this.props.closeModal}
      >
        <div className={classes.formContainer}>
          <label className={classes.label} htmlFor="classNumber">
            Class name
          </label>
          <div className={classes.classFieldContainer}>
            <span className={classes.classPrefix}>CLass </span>
            <input
              ref="classNrInput"
              className={classes.classNumber}
              placeholder="Class number"
              name="classNumber"
              type="text"
              value={this.state.classNumber}
              onChange={this.handleChangeClassNameInput}
            />
          </div>
          <label className={classes.label} htmlFor="startingDate">
            Starting date of module
            <span className={classes.dateInstr}>
              (If you choose a date that is not a Suday, the date picker will go
              automatically to the next Sunday)
            </span>
          </label>
          <input
            id="startingDate"
            type="date"
            min={new moment().format('YYYY-MM-DD')}
            value={this.state.starting_date}
            onChange={this.handleChangeStartingDateInput}
          />
          <div className={classes.btnsContainer}>
            <span className={classes.errorMessage}>
              {this.state.errorMessage}
            </span>
            <div>
              <button
                className={`${classes.btn} ${classes.ok}`}
                onClick={this.addNewClass}
              >
                Add class
              </button>
              <button
                className={`${classes.btn} ${classes.cancel}`}
                onClick={this.props.closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
