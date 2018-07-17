import React, { Component } from 'react';
import Styles from './selectStudent.css';

class Student extends Component {
  render() {
    const { member, handelSelected } = this.props;
    return (
      <div>
        <ul className={Styles.studentContent} key={member.id}>
          <li>
            <span className={Styles.sName}>{member.full_name}</span>
          </li>
          <li className={Styles.imgContainer}>
            <img
              className={Styles.img}
              src={`https://avatars.githubusercontent.com/${member.username}`}
              alt={member.full_name}
              title={member.full_name}
            />
          </li>
          <li>
            <input
              type="checkbox"
              defaultChecked={member.selected}
              // disabled={isAvailableTickets === 0}
              onChange={() => handelSelected(member)}
            />
          </li>
          <li>
            <span className={Styles.sInfo}>{member.role}</span>
            <span className={Styles.sInfo}>{member.group_name}</span>
          </li>
        </ul>
      </div>
    );
  }
}

export default Student;
