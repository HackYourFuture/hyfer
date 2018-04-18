import React, { Component } from 'react';
import Modal from '../../../../../Helpers/Modal/Modal';
import classes from './addNewModuleModal.css';
import { timelineStore } from '../../../../../store';
import moment from 'moment';

export default class AddNewModuleModal extends Component {
  state = {
    selectedDate: '',
    selectedGroup: '',
    selectedModuleId: '',
    duration: '',
    validDate: null,
    errorMessage: '',
    mountedFirstTime: false,
    minDate: '',
    maxDate: ''
  };

  getSharedDatesBetweenGroups = () => {
    return timelineStore.getSharedDates(this.props.items);
  };

  handleChangeDuration = e => {
    this.setState({ duration: e.target.value });
  };

  handleChangeGroup = e => {
    const groupName = e.target.value;
    this.setState({ selectedGroup: groupName });
    if (groupName !== 'All classes') {
      const modules = this.props.items[groupName];
      const startingsOfModule = modules.map(module => module.starting_date);
      const min = moment.min(startingsOfModule);
      const endingsOfModule = modules.map(module => module.ending_date);
      const max = moment.max(endingsOfModule);
      this.setState({
        minDate: min.format('YYYY-MM-DD'),
        maxDate: max.format('YYYY-MM-DD')
      });
    } else {
      const { min, max } = this.getSharedDatesBetweenGroups();
      this.setState({
        minDate: min.format('YYYY-MM-DD'),
        maxDate: max.format('YYYY-MM-DD')
      });
    }
  };

  handleChangeSelectedModuleId = e => {
    this.setState({ selectedModuleId: e.target.value });
  };

  handleChangeDate = e => {
    // check there's no value selected in the date picker
    if (!e.target.value) {
      this.setState({
        validDate: false,
        errorMessage: 'Please provide a starting date for the module'
      });
      return;
    }
    const allSundays = timelineStore.getState().allSundays;

    let date = moment(e.target.value);
    const wantedDay = 0; // sunday
    const daysDif = date.day() - wantedDay; // till sunday
    date.subtract(daysDif, 'days'); // keep going back in the week until it's a sunday

    let settingValidDateWith = false;
    let thatSunday = null;
    // loop through all sundays and if it's not betweens them tell the user it cannot be done
    allSundays.forEach(sunday => {
      if (sunday.diff(date) === 0) {
        thatSunday = date.format('YYYY-MM-DD');
        settingValidDateWith = true;
      }
    });
    this.setState({
      validDate: settingValidDateWith
    });
    if (settingValidDateWith) {
      this.setState({ selectedDate: thatSunday, errorMessage: '' });
    } else {
      this.setState({
        errorMessage:
          'Please provide a date that is not out of the range of current classes'
      });
    }
  };

  renderSelectModule = modules => {
    return (
      <select
        className={classes.select}
        name="modulesSelect"
        value={this.state.selectedModuleId}
        onChange={this.handleChangeSelectedModuleId}
      >
        {modules.map(module => (
          <option key={module.module_name} value={module.id}>
            {module.module_name}
          </option>
        ))}
      </select>
    );
  };

  renderSelectGroup = groups => {
    return (
      <select
        className={classes.select}
        name="groupSelect"
        value={this.state.selectedGroup}
        onChange={this.handleChangeGroup}
      >
        {groups.map(group => (
          <option key={group} value={group}>
            {group}
          </option>
        ))}
      </select>
    );
  };

  renderDurationOfModule = () => {
    return (
      <select
        className={classes.select}
        name="durationOfModule"
        value={this.state.duration}
        onChange={this.handleChangeDuration}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>
    );
  };

  handleAddModule = e => {
    if (!this.state.validDate) {
      this.setState({
        errorMessage:
          'Please provide a valid starting date for the module to be added'
      });
      return;
    }
    const { items } = this.props;
    // this step is weird but it's just to pass the modules of a class instead of all of them, or if all classes is selected pass em all
    let className = Object.keys(items).filter(
      group => group === this.state.selectedGroup
    );
    className = className.length === 0 ? 'All classes' : className[0];

    const modulesOfGroup = items[className] || items;

    const {
      selectedGroup,
      duration,
      selectedDate,
      selectedModuleId
    } = this.state;
    let groupWithId = 'All classes';
    // if the classname is all classes don't get the object group with id on it, cause there isn't one for all classes
    if (className !== 'All classes') {
      groupWithId = this.props.groupsWithIds.filter(
        group => group.group_name === selectedGroup // if something matched it is instead of 'All classes'
      )[0];
    }

    timelineStore
      .handleAddModule(
        selectedModuleId,
        groupWithId,
        duration,
        selectedDate,
        modulesOfGroup
      )
      .then(() => {
        // this.setInitialState(this.props);
        this.props.closeModal();
      });
  };

  setInitialState = props => {
    const { modules, groups, items } = props;
    if (!modules || !groups || !items) return;
    const { min, max } = this.getSharedDatesBetweenGroups();
    this.setState({
      selectedGroup: 'All classes',
      selectedModuleId: modules[0].id,
      duration: 1,
      mountedFirstTime: true,
      minDate: min.format('YYYY-MM-DD'),
      maxDate: max.format('YYYY-MM-DD')
    });
  };

  // set up the default state
  componentWillReceiveProps = props => {
    if (!this.state.mountedFirstTime) {
      this.setInitialState(props);
    }
  };

  render() {
    const { groups } = this.props;
    const { modules, allSundays } = timelineStore.getState();
    if (!groups || !modules || !allSundays) return null;
    const groupsPlus = ['All classes', ...groups];

    return (
      <Modal
        title="Add a new module"
        visible={this.props.isToggled}
        closeModal={this.props.closeModal}
      >
        <div className={classes.formContainer}>
          <label className={classes.label} htmlFor="groupSelect">
            Group
          </label>
          {this.renderSelectGroup(groupsPlus)}
          <label className={classes.label} htmlFor="moduleSelect">
            Module
          </label>
          {this.renderSelectModule(modules)}
          <label className={classes.label} htmlFor="durationOfModule">
            Duration (weeks)
          </label>
          {this.renderDurationOfModule()}
          <label className={classes.label} htmlFor="sundaySelect">
            Starting date of module
            <span className={classes.dateInstr}>
              (If you choose a date that is not a suday, the date picker will
              roll back to the last sunday)
            </span>
          </label>
          <input
            type="date"
            className={classes.dateInput}
            name="sundaySelect"
            value={this.state.selectedDate}
            onChange={this.handleChangeDate}
            min={this.state.minDate}
            max={this.state.maxDate}
          />
          <div className={classes.btnsContainer}>
            <div>
              <button
                className={`${classes.btn} ${classes.ok}`}
                onClick={this.props.closeModal}
              >
                CANCEL
              </button>
              <button
                className={`${classes.btn} ${classes.cancel}`}
                onClick={this.handleAddModule}
              >
                OK
              </button>
            </div>
            <span className={classes.errorMessage}>
              {this.state.errorMessage}
            </span>
          </div>
        </div>
      </Modal>
    );
  }
}
