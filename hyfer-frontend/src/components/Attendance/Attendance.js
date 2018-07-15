import React from 'react';
// import StudentWithWeeks from './StudentWithWeeks';
import WeekIndicator from './WeekIndicator';
import styles from '../../assets/styles/attendance.css';
import { notify } from 'react-notify-toast';
import { inject, observer } from 'mobx-react';
const stack = [];

@inject('currentModuleStore')
@observer
export default class Attendance extends React.Component {
  state = {
    edit_Mode: false,
  };

  renderHistory(history) {
    const { attendance, homework, duration } = history;
    const pairs = [];
    for (let i = 0; i < duration; i += 1) {
      pairs.push(`A[${attendance[i]}] H[${homework[i]}]`);
    }
    return pairs.join(' - ');
  }

  renderStudents(students) {
    return students.map(student => {
      const { full_name, history } = student;
      return (
        <div className={styles.Attendant} key={student.id}>
          <div>
            <h3>{full_name} {this.renderHistory(history)}</h3>
          </div>
        </div>
      );
    });
  }
  render() {
    const { students, module, group, currentModule } = this.props.currentModuleStore;
    let title = null;
    let buttons = null;

    if (students == null) {
      return null;
    }

    const content = this.renderStudents(students);

    title = (
      <div className={styles.Title}>
        <h3 className={styles.Title_inner}>
          Attendance - {module.module_name}
        </h3>
      </div>
    );

    buttons = (
      <div className={styles.buttons}>
        <button
          className={styles.button_save}
          disabled={!this.state.edit_Mode}
          name="save"
          onClick={this.onSave}
        >
          Save
          </button>
        <button
          className={styles.button_undo}
          disabled={!this.state.edit_Mode}
          name="undo"
          onClick={this.undo}
        >
          Undo
          </button>
        <button
          className={styles.button_cancel}
          disabled={!this.state.edit_Mode}
          name="cancel"
          onClick={this.onCancel}
        >
          Cancel
          </button>
      </div>
    );

    return (
      <div>
        {title}
        <div className={styles.wrapper}>
          <div className={styles.group_name}>
            <h3 className={styles.group_name_inner}>{group.group_name}</h3>
            <WeekIndicator />
            duration={currentModule.duration}
          </div>
          <div className={styles.content_wrapper}>{content}</div>
          {buttons}
        </div>
      </div>
    );
  }

  handleCheckboxChange = (student, event) => {
    const week = event.target.id;
    const name = event.target.name; //attendance or homework
    // edit_mode will active the save and cancel buttons
    this.setState({
      edit_Mode: true,
    });
    stack.push(student, week, name);
    this.makeChange(student, week, name);
  };

  makeChange = (student, week, name) => {
    const { history } = this.state;
    const changeValue = v => {
      if (v === 0) {
        return 1;
      } else if (v === 1) {
        return 0;
      }
    };
    // change in history object
    history[student][week][name] = changeValue(history[student][week][name]);
    this.setState({
      history: history,
    });
  };

  onSave = () => {
    const token = localStorage.getItem('token');
    const body = this.state.history;

    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/history`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then(response => response.json())
      .then(notify.show('Your changes are successfully Saved !', 'success'))
      .catch(err => console.log(err));
    this.setState({
      edit_Mode: null,
    });
  };

  onCancel = () => {
    for (let i = 0; i < stack.length; i++) {
      this.undo();
    }
    notify.show('Your changes have been cancelled !', 'warning');
  };

  undo = () => {
    const toUndo = stack.slice(-3);
    stack.splice(-3, 3);
    const student = toUndo[0];
    const week = toUndo[1];
    const name = toUndo[2];
    if (stack.length === 0) {
      this.setState({
        edit_Mode: null,
      });
    }
    this.makeChange(student, week, name);
  };
}
