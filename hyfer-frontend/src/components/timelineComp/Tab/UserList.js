import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { inject, observer } from 'mobx-react';
import UserCard from './UserCard';

const styles = () => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: '#fafafa',
    position: 'relative',
  },
  fab: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});

@inject('currentModuleStore')
@observer
class UserList extends React.Component {

  addTeacher = () => {
    console.log("Show the AddTeacherDialog here");
  }

  render() {
    const { classes, currentModuleStore, role } = this.props;
    const { students, teachers } = currentModuleStore;
    let users = role === 'teacher' ? teachers : students;
    users = users.sort((a, b) => a.username.localeCompare(b.username));

    return (
      <div className={classes.container}>
        {users.map(user => <UserCard key={user.id} user={user} />)}
        {role === 'teacher' &&
          <Button
            onClick={this.handleClick}
            variant="fab"
            color="secondary"
            aria-label="add"
            className={classes.fab}>
            <AddIcon />
          </Button>}
      </div>
    );
  }
}

UserList.wrappedComponent.UserList = {
  currentModuleStore: PropTypes.object.isRequired,
  role: PropTypes.string.isRequired,
};

export default withStyles(styles)(UserList);
