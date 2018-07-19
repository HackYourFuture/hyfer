import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

@inject('currentModuleStore', 'currentUser')
@observer
export default class Attendance extends Component {

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
    const { user, selectedWeek, currentUser } = this.props;
    const { attendance, homework } = user.history[selectedWeek];

    return (
      <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
        <FormControlLabel
          style={{ marginLeft: 10 }}
          control={
            <Checkbox
              checked={Boolean(attendance)}
              onChange={this.saveAttendance}
              value="present"
              disabled={!currentUser.isTeacher}
            />
          }
          label="present"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={Boolean(homework)}
              onChange={this.saveHomework}
              value="homework"
              disabled={!currentUser.isTeacher}
            />
          }
          label="homework"
        />
      </div>
    );
  }
}

Attendance.wrappedComponent.propTypes = {
  currentModuleStore: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  selectedWeek: PropTypes.number.isRequired,
  user: PropTypes.object.isRequired,
};
