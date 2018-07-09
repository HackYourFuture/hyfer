import React from 'react';
import styles from '../../assets/styles/attendance.css';
import { inject, observer } from 'mobx-react';

@inject('currentModuleStore')
@observer
export default class WeekIndicator extends React.Component {
  render() {
    const { currentModule, students, history } = this.props.currentModuleStore;
    const { duration, git_repo } = currentModule;
    let studentHistory;
    if (duration !== null && students.length !== 0 && git_repo != null) {
      for (let i = 0; i < students.length; i++) {
        studentHistory = history[students[i]];
      }
      const weeks = studentHistory.map((week, duration) => (
        <div className={styles.week_indicator} key={duration}>
          <h3>week {duration + 1}</h3>
        </div>
      ));
      return weeks;
    } else {
      return null;
    }
  }
}
