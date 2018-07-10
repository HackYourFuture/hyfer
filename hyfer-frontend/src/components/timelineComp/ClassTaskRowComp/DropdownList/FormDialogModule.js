import React, { Fragment, Component } from 'react';
import {
  Dialog, Select,Toolbar,Divider,
  DialogContent,Button,ListItemText,
  MenuItem,FormControl,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { errorMessage } from '../../../../notify';

import { observer, inject } from 'mobx-react';

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 300,
  },
});

@inject('timeLineStore')
@observer
  export default withStyles(styles)(class FormDialogModule extends Component {
    state = {
    open: false,
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
    
    ComponentDidMount() {
    this.setState({
      open: this.props.open,
    });
    }
    
    handleClickOpen = () => {
    this.setState({ open: true });
    };
    
    handleClose = () => {
    this.setState({ open: false });
    };
    
    handleChangeDuration = e => {
    this.setState({ duration: e.target.value });
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
      const { classes } = this.props;
      const { groups } = this.props.timeLineStore;
      // const { modules } = this.props.timeLineStore;
      // const { allSundays } = this.props.timeLineStore;
      // if (!groups || !modules || !allSundays) return null;
      //const groupsPlus = ['All classes', ...groups];//
    
      return (<Fragment>
        <Dialog open={this.props.open}
          onClose={this.props.onClose}
        >
          <Toolbar>
            <Typography variant="title" color="inherit" style={{ flex: 1 }} >
              Add a new module
            </Typography>
            <Button color="inherit" onClick={this.handleAddModule}>
              Save
            </Button>
            <Button variant='fab' mini color="inherit" onClick={this.props.onClose} aria-label="Close">
              <CloseIcon />
            </Button>
          </Toolbar>
          <DialogContent>
            <form>
              <FormControl className={classes.formControl}>
                <ListItemText primary="Select Group" />
                <Select
                  name="groupSelect"
                  value={this.state.selectedGroup}
                  onChange={this.handleChangeGroup}
                >
                  {groups.map(group => (
                    <MenuItem key={group} value={group}>
                      {group}
                    </MenuItem>
                  ))} 
                </Select>
                <Divider />
              </FormControl >
              <br />
              <FormControl className={classes.formControl}>
                <ListItemText primary="Select Module" />
                <Select
                  name="modulesSelect"
                  value={this.state.selectedModuleId}
                  onChange={this.handleChangeSelectedModuleId}
                >
                  {/* {modules.map(module => (
                    <MenuItem key={module.module_name} value={module.id}>
                      {module.module_name}
                    </MenuItem>
                  ))} */}
                </Select>
              </FormControl>
              <br />
              <FormControl className={classes.formControl}>
                <ListItemText primary="Select Duration" />
                <Select
                  name="durationOfModule"
                  value={this.state.duration}
                  onChange={this.handleChangeDuration}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <br />
              <FormControl className={classes.formControl}>
                <ListItemText primary="Select Start Date" />
                  <input
                  type="date"
                  name="sundaySelect"
                  value={this.state.selectedDate}
                  onChange={this.handleChangeDate}
                  min={this.state.minDate}
                  max={this.state.maxDate}
            />
              </FormControl>
              <span >
                {this.state.errorMessage}
              </span>
            </form>
          </DialogContent>
        </Dialog>
      </Fragment>
      );
  }
});

