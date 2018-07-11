import React from 'react';
import Checkbox from '../../Helpers/Checkbox/Checkbox';
import styles from '../../assets/styles/attendance.css';
import { inject, observer } from 'mobx-react';

@inject('currentModuleStore')
@observer
export default class StudentWithWeeks extends React.Component {
  render() {
    return this.renderWeeks();
  }

  //this function will render check boxes for each student base on weeks
  renderWeeks() {
    const { history, students } = this.props.currentModuleStore;
    let studentHistory;
    for (let i = 0; i < students.length; i++) {
      studentHistory = history[students[i]];
    }
    const weeks = studentHistory.map((week, duration) => (
      <div className={styles.week_checkboxes} key={duration}>
        <Checkbox
          onChange={duration => {
            this.props.onChange(duration, this.props.student);
          }}
          id={duration}
          homeworkChecked={id =>
            this.getIsHomeworkChecked(id, this.props.student)
          }
          AttendanceChecked={id =>
            this.getIsAttendanceChecked(id, this.props.student)
          }
        />
      </div>
    ));
    return weeks;
  }

  getIsHomeworkChecked = (id, student) => {
    return this.props.currentModuleStore.history[student][id].homework === 1;
  };

  getIsAttendanceChecked = (id, student) => {
    return this.props.currentModuleStore.history[student][id].attendance === 1;
  };
}
