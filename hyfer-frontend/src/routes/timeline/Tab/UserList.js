import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { inject, observer } from 'mobx-react';
import UserCard from '../../../components/UserCard';
import AddTeacherDialog from './AddTeacherDialog';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: '#fafafa',
    position: 'relative',
    margin: theme.spacing.unit,
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
class UserList extends React.Component {

  state = {
    isOpen: false,
  }

  openDialog = () => {
    this.setState({ isOpen: true });
  }

  closeDialog = () => {
    this.setState({ isOpen: false });
  }

  renderUsers(role, users) {
    const { classes } = this.props;
    if (users.length === 0) {
      return (
        <Typography variant="subheading" color="textSecondary" align="center" className={classes.text}>
          The list of {role === 'teacher' ? 'teachers' : 'students'} for this module is empty.
        </Typography>
      );
    }
    return users.map(user => <UserCard key={user.id} user={user} showDeleteButton={role === 'teacher'} />);
  }

  render() {
    const { classes, currentUser, currentModuleStore, role } = this.props;
    const { currentModule, students, teachers } = currentModuleStore;
    let users = role === 'teacher' ? teachers : students;
    users = users.sort((a, b) => a.username.localeCompare(b.username));

    return (
      <div className={classes.root}>
        {this.renderUsers(role, users)}
        {role === 'teacher' && currentModule && currentUser.isTeacher &&
          <React.Fragment>
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
          </React.Fragment>}
      </div>
    );
  }
}

UserList.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentModuleStore: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  role: PropTypes.string.isRequired,
};

export default withStyles(styles)(UserList);
