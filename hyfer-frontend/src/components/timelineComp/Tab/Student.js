import React from 'react';
import styles from '../../../assets/styles/users.css';
import User from './Users';
import { inject, observer } from 'mobx-react';
@inject('currentModuleStore')
@observer
export default class Student extends React.Component {
  render() {
    const { students } = this.props.currentModuleStore;
    return (
      <li className={styles.userList}>
        <ul className={styles.userContainer}>
          {students.map(user => {
            return (
              <User key={user.id} user={user} />
            );
          })}
        </ul>
      </li>
    );
  }
}
