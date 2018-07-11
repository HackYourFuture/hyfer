import React, { Component } from 'react';
import Modal from '../../../../../Helpers/Modal/Modal';
import classes from './addNewModuleModal.css';
import moment from 'moment';
import { errorMessage } from '../../../../../notify';
import { observer, inject } from 'mobx-react';

@inject('timeLineStore')
@observer
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
    maxDate: '',
  };

  getSharedDatesBetweenGroups = () => {
    const items = this.props.timeLineStore.items;
    const keys = Object.keys(items);
    const minAndMax = keys.reduce(
      (acc, key) => {
        const modules = items[key];
        const startingsOfModule = modules.map(module => module.starting_date);
        const minCurrentModules = moment.min(startingsOfModule);
        if (minCurrentModules.day() !== 0) {
          const daysToSunday = 7 - minCurrentModules.day();
          for (let x = 0; x < daysToSunday; x++) {
            minCurrentModules.add(1, 'day');
          }
        }
        const endingsOfModule = modules.map(module => module.ending_date);
        const maxCurrentModules = moment.max(endingsOfModule);
        if (acc.min && acc.max) {
          const min =
            minCurrentModules.diff(acc.min) > 0 ? minCurrentModules : acc.min;
          const max =
            maxCurrentModules.diff(acc.max) < 0 ? maxCurrentModules : acc.max;
          return {
            min,
            max,
          };
        } else {
          return {
            min: minCurrentModules,
            max: maxCurrentModules,
          };
        }
      },
      { min: '', max: '' }
    );
    return minAndMax;
  }

  handleChangeDuration = e => {
    this.setState({ duration: e.target.value });
  };

  handleChangeGroup = e => {
    const groupName = e.target.value;
    this.setState({ selectedGroup: groupName });
    if (groupName !== 'All classes') {
      const modules = this.props.timeLineStore.items[groupName];
      const startingsOfModule = modules.map(module => module.starting_date);
      const min = moment.min(startingsOfModule);
      const endingsOfModule = modules.map(module => module.ending_date);
      const max = moment.max(endingsOfModule);
      this.setState({
        minDate: moment(min).format('YYYY-MM-DD'),
        maxDate: moment(max).format('YYYY-MM-DD'),
      });
    } else {
      const { min, max } = this.getSharedDatesBetweenGroups();
      this.setState({
        minDate: moment(min).format('YYYY-MM-DD'),
        maxDate: moment(max).format('YYYY-MM-DD'),
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
        errorMessage: 'Please provide a starting date for the module',
      });
      return;
    }
    const allSundays = this.props.timeLineStore.allSundays;
    const date = moment(e.target.value);
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
      validDate: settingValidDateWith,
    });
    if (settingValidDateWith) {
      this.setState({ selectedDate: thatSunday, errorMessage: '' });
    } else {
      this.setState({
        errorMessage:
          'Please provide a date that is not out of the range of current classes',
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

  handleAddModule = () => {
    if (!this.state.validDate) {
      this.setState({
        errorMessage:
          'Please provide a valid starting date for the module to be added',
      });
      return;
    }
    const { items } = this.props.timeLineStore;
    // this step is weird but it's just to pass the modules of a class instead of all of them, or if all classes is selected pass em all
    let className = Object.keys(items).filter(
      group => group === this.state.selectedGroup,
    );
    className = className.length === 0 ? 'All classes' : className[0];

    const modulesOfGroup = items[className] || items;

    const {
      selectedGroup,
      duration,
      selectedDate,
      selectedModuleId,
    } = this.state;
    let groupWithId = 'All classes';
    // if the classname is all classes don't get the object group with id on it, cause there isn't one for all classes
    if (className !== 'All classes') {
      groupWithId = this.props.timeLineStore.groupsWithIds.filter(
        group => group.group_name === selectedGroup, // if something matched it is instead of 'All classes'
      )[0];
    }
    const { modules } = this.props.timeLineStore;
    this.addNewModuleToClass(
        selectedModuleId,
        groupWithId,
        duration,
        selectedDate,
        modulesOfGroup,
        modules
    )
      .then(() => {
        this.props.closeModal();
      })
      .catch(errorMessage); // catching the error By propagation from src/store/TimeLineStore
  };

  addNewModuleToClass = (
    selectedModuleId,
    selectedGroup,
    duration,
    selectedDate,
    items,
    modules
  ) => {
    if (selectedGroup !== 'All classes') {
      return this._patchNewModuleForOneGroup(
        selectedModuleId,
        selectedDate,
        duration,
        selectedGroup.id,
        items,
        modules
      );
    } else {
      const allGroups = Object.keys(items);
      const allPromises = [];
      allGroups.forEach(group => {
        const groupsItems = items[group];
        const groupId = groupsItems[0].id;
        allPromises.push(
          this._patchNewModuleForOneGroup(
            selectedModuleId,
            selectedDate,
            duration,
            groupId,
            groupsItems,
            modules
          )
        );
      });
      return Promise.all(allPromises);
    }
  }

  _patchNewModuleForOneGroup = (
    selectedModuleId,
    selectedDate,
    duration,
    selectedGroupId,
    items,
    modules
  ) => {
    const selectedDateMoment = new moment(selectedDate, 'YYYY-MM-DD');
    for (const item of items) {
      // case 1 it is between the starting and the end! Nasty!!/////////////////////////////////////////////
      if (selectedDateMoment.isBetween(item.starting_date, item.ending_date)) {
        // step 1 make that module shorter so that the new module could come right after
        const newDuration = this._getNewDurationWhenAddingModule(
          selectedDateMoment,
          item
        );
        // send to backend the new duration to the backend
        return this.props.timeLineStore.patchGroupsModules(
          item,
          item.position,
          newDuration,
          null,
          null,
          selectedGroupId
        ).then(() => {
          //step 2 add the new module after that one
          const position = +item.position + 1;
          // 1- add it
          return this.props.timeLineStore.addModule(selectedModuleId, selectedGroupId, position)
            .then(() =>
              // 2- change the duration
              this.props.timeLineStore.patchGroupsModules(
                { position },
                null,
                duration,
                null,
                null,
                selectedGroupId
              )
            )
            .then(() => {
              // step 3 add the new module
              const remainingDuration = item.duration - newDuration;
              const otherHalfPosition = position + 1;
              const splittedModuleId = modules.filter(
                one => one.module_name === item.module_name
              )[0].id;
              return (
                this.props.timeLineStore.addModule(splittedModuleId, selectedGroupId, otherHalfPosition)
                  // now adjust the duration so that it's just the rest of the module not a new one
                  .then(() => {
                    return this.props.timeLineStore.patchGroupsModules(
                      { position: otherHalfPosition }, //instead of whole item just the part with position
                      null,
                      remainingDuration,
                      null,
                      null,
                      selectedGroupId
                    );
                  })
              );
            });
        });
      }
      if (selectedDateMoment.diff(item.ending_date, 'weeks') === 0) {
        // case 2 the new module is at the end of an existing one (GREAT!)//////////////////////////////////////////////////
        const position = +item.position + 1;
        return this.props.timeLineStore.addModule(selectedModuleId, selectedGroupId, position)
          .then(() =>
            this.props.timeLineStore.patchGroupsModules(
              { position },
              null,
              duration,
              null,
              null,
              selectedGroupId
            )
          );
      }
    }
  }

  _getNewDurationWhenAddingModule = (selectedDate, module) => {
    return selectedDate.diff(module.starting_date, 'week');
  }
  
  setInitialState = props => {
    const { modules } = props.timeLineStore;
    const { groups, items } = props;
    if (!modules || !groups || !items) return;
    const { min, max } = this.getSharedDatesBetweenGroups();
    this.setState({
      selectedGroup: 'All classes',
      selectedModuleId: modules[0].id,
      duration: 1,
      mountedFirstTime: true,
      minDate: moment(min).format('YYYY-MM-DD'),
      maxDate: moment(max).format('YYYY-MM-DD'),
    });
  };

  // set up the default state
  UNSAFE_componentWillReceiveProps = props => {
    if (!this.state.mountedFirstTime) {
      this.setInitialState(props);
    }
  };

  render() {
    const { groups } = this.props.timeLineStore;
    const { modules } = this.props.timeLineStore;
    const { allSundays } = this.props.timeLineStore;
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
              (If you choose a date that is not a Sunday, the date picker will
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
          <div className={classes.buttonsContainer}>
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
