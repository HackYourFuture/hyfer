import React from 'react';
import styles from '../../../assets/styles/users.css';
import User from './Users';
import { inject, observer } from 'mobx-react';
@inject('currentModules')
@observer
export default class Student extends React.Component {
  render() {
    const { moduleUsers  } = this.props.currentModules;
    return (

      <li className={styles.userList}>
        <ul className={styles.userContainer}>
          {moduleUsers.map(user => {
            return (
              <User key={user.id} user={user} />
            );
          })}
        </ul>
      </li>
    );
  }
}
