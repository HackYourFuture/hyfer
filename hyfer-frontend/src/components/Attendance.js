import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const styles = () => ({
});

@inject('currentModuleStore', 'currentUser')
@observer
class Attendance extends Component {

  saveAttendance = (e) => {
    const { user, selectedWeek } = this.props;
    this.props.currentModuleStore.saveAttendance(user, selectedWeek, {
      ...user.history[selectedWeek],
      attendance: e.target.checked ? 1 : 0,
    });
  }

  saveHomework = (e) => {
    const { user, selectedWeek } = this.props;
    this.props.currentModuleStore.saveAttendance(user, selectedWeek, {
      ...user.history[selectedWeek],
      homework: e.target.checked ? 1 : 0,
    });
  }

  render() {
    const { classes, user, selectedWeek, currentUser } = this.props;
    const { attendance, homework } = user.history[selectedWeek];

    return (
      <FormGroup>
        <FormControlLabel
          className={classes.checkBox}
          control={
            <Switch
              checked={Boolean(attendance)}
              onChange={this.saveAttendance}
              value="present"
              disabled={!currentUser.isTeacher}
            />
          }
          label={`Present wk ${selectedWeek + 1}`}
        />
        <FormControlLabel
          control={
            <Switch
              className={classes.checkBox}
              checked={Boolean(homework)}
              onChange={this.saveHomework}
              value="homework"
              disabled={!currentUser.isTeacher}
            />
          }
          label={`Homework wk ${selectedWeek + 1}`}
        />
      </FormGroup>
    );
  }
}

Attendance.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentModuleStore: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  selectedWeek: PropTypes.number.isRequired,
  user: PropTypes.object.isRequired,
};

export default withStyles(styles)(Attendance);
