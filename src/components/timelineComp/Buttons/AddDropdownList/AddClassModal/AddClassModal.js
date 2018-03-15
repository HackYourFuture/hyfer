import React, { Component } from 'react';
import Modal from '../../../../../Helpers/Modal/Modal';
import classes from './addClassModal.css';
import { timelineStore } from '../../../../../store/';

// TODO: Style the form like the one on Hyfer
export default class AddClassModal extends Component {
  state = {
    classNumber: '',
    starting_date: '',
    errorMessage: ''
  };

  // onFocus = e => {
  //   this.setState({ focusId: e.target.id });
  // };
  // onBlur = e => {
  //   this.setState({ focusId: '' });
  // };

  handleChangeClassNameInput = e => {
    const { value } = e.target;
    this.setState({ classNumber: value });
    const { starting_date } = this.state;
    if (value && starting_date) {
      this.setState({ errorMessage: '' });
    }
  };

  handleChangeStartingDateInput = e => {
    // if all valid remove weird error message
    const { value } = e.target;
    const { classNumber } = this.state;
    if (classNumber && value) {
      this.setState({ errorMessage: '' });
    }
    this.setState({ starting_date: value });
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
      <div>
        <Modal
          title="Add a new class"
          visible={this.props.isToggled}
          closeModal={this.props.closeModal}
        >
          <label htmlFor="classNumber">Class name</label>
          <div>
            <span>CLass </span>
            <input
              required
              placeholder="Class number"
              name="classNumber"
              type="number"
              value={this.state.classNumber}
              onChange={this.handleChangeClassNameInput}
            />
          </div>
          <label htmlFor="starting_date">Starting date</label>
          <input
            required
            id="starting_date"
            type="date"
            value={this.state.starting_date}
            onChange={this.handleChangeStartingDateInput}
          />
          <button onClick={this.addNewClass}>Add class</button>
          <button onClick={this.props.closeModal}>Cancel</button>
          <span>{this.state.errorMessage}</span>
        </Modal>
      </div>
    );
  }
}
