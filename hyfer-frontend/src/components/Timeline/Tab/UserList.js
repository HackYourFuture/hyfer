import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { inject, observer } from 'mobx-react';
import UserCard from '../../Users/UserCard';
import AddTeacherDialog from './AddTeacherDialog';

const styles = () => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: '#fafafa',
    position: 'relative',
    minHeight: 100,
  },
  fab: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});

@inject('currentModuleStore', 'global')
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

  render() {
    const { classes, currentModuleStore, role } = this.props;
    const { students, teachers } = currentModuleStore;
    let users = role === 'teacher' ? teachers : students;
    users = users.sort((a, b) => a.username.localeCompare(b.username));

    return (
      <div className={classes.container}>
        {users.map(user => <UserCard key={user.id} user={user} showDeleteButton={role === 'teacher'} />)}
        {role === 'teacher' && this.props.global.isTeacher &&
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

UserList.wrappedComponent.UserList = {
  currentModuleStore: PropTypes.object.isRequired,
  global: PropTypes.object.isRequired,
  role: PropTypes.string.isRequired,
};

export default withStyles(styles)(UserList);
