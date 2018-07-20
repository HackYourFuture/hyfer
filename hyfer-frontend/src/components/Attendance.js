import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing.unit / 2,
    ...theme.mixins.gutters({
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2,
    }),
  },
  formGroup: {
    marginTop: theme.spacing.unit,
  },
  checkbox: {
    height: 32,
  },
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
      <Paper className={classes.root}>
        <FormGroup classes={{ root: classes.formGroup }}>
          <FormControlLabel
            className={classes.checkBox}
            control={
              <Checkbox
                classes={{ root: classes.checkbox }}
                checked={Boolean(attendance)}
                onChange={this.saveAttendance}
                value="present"
                disabled={!currentUser.isTeacher}
              />
            }
            label="Present"
          />
          <FormControlLabel
            control={
              <Checkbox
                classes={{ root: classes.checkbox }}
                checked={Boolean(homework)}
                onChange={this.saveHomework}
                value="homework"
                disabled={!currentUser.isTeacher}
              />
            }
            label="Homework"
          />
        </FormGroup>
      </Paper>
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
