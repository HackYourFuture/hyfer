import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Select from '@material-ui/core/Select';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';
import UserCard from '../../../components/UserCard';
import AddTeacherDialog from './AddTeacherDialog';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: '#fafafa',
    position: 'relative',
    margin: theme.spacing.unit,
  },
  toolbar: {
    margin: theme.spacing.unit,
    width: 240,
  },
  select: {
    marginLeft: theme.spacing.unit,
  },
  selectItem: {
    textAlign: 'center',
  },
  text: {
    margin: theme.spacing.unit,
    flex: 1,
  },
  fab: {
    position: 'absolute',
    top: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
});

@inject('currentModuleStore', 'currentUser')
@observer
class UserList extends Component {

  state = {
    isOpen: false,
    selectedWeek: 0,
    showAttendences: false,
  }

  openDialog = () => {
    this.setState({ isOpen: true });
  }

  closeDialog = () => {
    this.setState({ isOpen: false });
  }

  renderUsers(role, users, selectedWeek) {
    const { classes, showAttendance } = this.props;
    if (users.length === 0) {
      return (
        <Typography variant="subheading" color="textSecondary" align="center" className={classes.text}>
          The list of {role === 'teacher' ? 'teachers' : 'students'} for this module is empty.
        </Typography>
      );
    }
    return users.map(user => (
      <UserCard
        key={user.id}
        user={user}
        selectedWeek={selectedWeek}
        showDeleteButton={role === 'teacher'}
        showAttendance={showAttendance}
      />
    ));
  }

  renderSelectItems(duration) {
    const items = [];
    for (let i = 0; i < duration; i++) {
      const label = `${i + 1}`;
      items.push(<MenuItem key={label} value={i}>{label}</MenuItem>);
    }
    return items;
  }

  handleWeekChange = (e) => this.setState({ selectedWeek: e.target.value })

  renderWeekSelector(classes, duration) {
    return (
      <Select
        className={classes.select}
        value={this.state.selectedWeek}
        onChange={this.handleWeekChange}
      >
        {this.renderSelectItems(duration)}
      </Select>
    );
  }

  render() {
    const { classes, currentUser, currentModuleStore, role } = this.props;
    const { currentModule, students, teachers } = currentModuleStore;
    let users = role === 'teacher' ? teachers : students;
    users = users.sort((a, b) => a.username.localeCompare(b.username));

    return (
      <div className={classes.root}>
        {role === 'student' &&
          <Paper className={classes.toolbar} elevation={2}>
            <Toolbar>
              <FormLabel>Selected Week</FormLabel>
              {this.renderWeekSelector(classes, currentModule.duration)}
            </Toolbar>
          </Paper>}
        <div className={classes.container}>
          {this.renderUsers(role, users, this.state.selectedWeek)}
          {role === 'teacher' && currentModule && currentUser.isTeacher &&
            <Fragment>
              <AddTeacherDialog
                open={this.state.isOpen}
                onClose={this.closeDialog}
              />
              <Button
                onClick={this.openDialog}
                variant="fab"
                color="secondary"
                aria-label="add"
                className={classes.fab}>
                <AddIcon />
              </Button>
            </Fragment>}
        </div>
      </div>
    );
  }
}

UserList.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentModuleStore: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  role: PropTypes.string.isRequired,
  showAttendance: PropTypes.bool,
};

export default withStyles(styles)(UserList);
