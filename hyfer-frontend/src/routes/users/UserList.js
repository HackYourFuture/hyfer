import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './users.css';
import UserCard from '../../components/UserCard';
import { inject, observer } from 'mobx-react';

const HEADINGS = {
  guest: 'Guest List',
  student: 'Student List',
  teacher: 'Teacher List',
};

@inject('users')
@observer
export class UserList extends Component {
  render() {
    const { role } = this.props;
    return (
      <li className={styles.userList}>
        {HEADINGS[role]}:
        <ul className={styles.userContainer}>
          {this.props.users.filteredUsers.map(user => {
            if (user.role === role) {
              return (
                <UserCard key={user.id} user={user} />
              );
            }
            return null;
          })}
        </ul>
      </li>
    );
  }
}

UserList.wrappedComponent.propTypes = {
  role: PropTypes.string.isRequired,
  users: PropTypes.object.isRequired,
};
