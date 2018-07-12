import React from 'react';
// import styles from '../../../assets/styles/users.css';
// import User from './Users';
import { inject, observer } from 'mobx-react';
import UsersCard from './UsersCard';

@inject('currentModuleStore')
@observer
export default class Student extends React.Component {
  render() {
    const { students } = this.props.currentModuleStore;
    return (
      <div style={{ maxWidth: "100%", maxHeight: "100%", display: "flex", flexWrap: "wrap" }}>

        {students.map(user => {
          return (
            <UsersCard key={user.id} user={user} />
          );
        })}
      </div>
    );
  }
}
