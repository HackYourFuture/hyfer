import React, { Component } from 'react';
import styles from '../../assets/styles/users.css';
import store from '../../store/UserStore';
import User from './User';

const HEADINGS = {
    guest: 'Guest List',
    student: 'Student List',
    teacher: 'Teacher List',
};


export class UserList extends Component {
    render() {
        const { role } = this.props;
      return (
        <li className={styles.userList}>
          {HEADINGS[role]}:
        <ul className={styles.userContainer}>
            {store.state.filteredUsers.map(user => {
              if (user.role === role) {
                return (
                  <User key={user.id} user={user} />
                );
              }
              return null;
            })}
          </ul>
        </li>
      );
    }
}
