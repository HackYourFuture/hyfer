import React, { Component } from 'react';

import styles from '../../assets/styles/addClassForm.css';
import Button from '../../Helpers/Button/Button';
import InputField from '../../Helpers//InputField/InputField';
import { timelineStore } from '../../store/';

export default class AddClassForm extends Component {
  state = {
    toBeAddedClass: '',
    toBeAddedDate: ''
  };

  handleChangeClassName = newClass => {
    this.setState({ toBeAddedClass: newClass });
  };

  handleChangeStartDate = newDate => {
    console.log(newDate);
    this.setState({
      toBeAddedDate: newDate
    });
  };

  handleAddClass = () => {
    const { toBeAddedClass, toBeAddedDate } = this.state;
    if (toBeAddedClass !== '' && toBeAddedDate !== '') {
      timelineStore.handleAddClass(toBeAddedClass, toBeAddedDate);
    }
  };
  render() {
    return (
      <div className={styles.container}>
        <label htmlFor="inputField" className={styles.label}>
          Class name
        </label>
        <InputField
          type="text"
          id="inputField"
          placeholder="Class name"
          className={styles.input}
          value={this.state.toBeAddedClass}
          onChange={this.handleChangeClassName}
        />
        <label htmlFor="dateField" className={styles.label}>
          Starting date
        </label>

        <InputField
          id="dateField"
          type="date"
          className={styles.input}
          placeholder="Start date"
          value={this.state.toBeAddedDate}
          onChange={this.handleChangeStartDate}
        />
        <Button onClick={this.handleAddClass} className={styles.addButton}>
          Add
        </Button>
      </div>
    );
  }
}
