import React, { Component } from 'react';

import Modal from '../../../../../Helpers/Modal/Modal';
import { timelineStore } from '../../../../../store/';
import classes from './assignTeacherModal.css';

export default class AssignTeacherModal extends Component {
  state = {
    teacher1: '',
    teacher2: '',
    selectedTeacher1: '',
    selectedTeacher2: '',
    warningMessage: ''
  };

  handleAssignTeahcers = () => {
    const { teacher1, teacher2 } = this.state;
    const { selectedModule } = this.props;
    timelineStore
      .handleAssignTeachers(selectedModule, teacher1, teacher2)
      .then(() => this.props.closeModal())
      .catch(err => console.log(err));
  };

  handleChangeTeacher = (e, num) => {
    if (num === 1) {
      this.setState({
        teacher1: e.target.value
      });
    } else {
      this.setState({
        teacher2: e.target.value
      });
    }
  };

  renderSelectTeacher = num => {
    const { teachers } = this.props;
    return (
      <select
        className={classes.select}
        name={`teacherSelect${num}`}
        value={this.state[`teacher${num}`]}
        onChange={e => this.handleChangeTeacher(e, num)}
      >
        <option value="" />
        {teachers.map(teacher => (
          <option key={teacher.id} value={teacher.id}>
            {teacher.username}
          </option>
        ))}
      </select>
    );
  };

  unAssignTeacher = num => {
    if (num === 1) {
      this.setState({ teacher1: '', selectedTeacher1: null });
    } else {
      this.setState({ teacher2: '', selectedTeacher2: null });
    }
    // this.setState({
    //   warningMessage:
    //     'You can only reassign a teacher! If you leave them open to the way they were'
    // });
  };

  renderAssignedTeacher = (teacher, num) => {
    return (
      <span className={classes.assignedTeacherWrapper}>
        <span
          onClick={() => this.unAssignTeacher(num)}
          className={classes.unAssignTeacher}
        >
          x
        </span>
        <span className={classes.teachersName}>{teacher.username}</span>
      </span>
    );
  };

  filterTeacher = (teachers, id) => {
    return teachers.filter(teacher => teacher.id === id)[0];
  };

  componentWillReceiveProps = props => {
    const { teachers, infoSelectedModule } = props;
    if (teachers && infoSelectedModule) {
      this.setState({ teacher1: teachers[0].id, teacher2: teachers[1].id });
      const { teacher1_id, teacher2_id } = infoSelectedModule;
      if (teacher1_id) {
        this.setState({ selectedTeacher1: teacher1_id });
      }
      if (teacher2_id) {
        this.setState({ selectedTeacher2: teacher2_id });
      }
    }
  };

  render() {
    const { selectedModule, teachers, infoSelectedModule } = this.props;
    let title;
    if (selectedModule) {
      const { module_name, group_name } = selectedModule;
      title = `Assign teachers to teach ${group_name} ${module_name} module`;
    }

    let selectTeacher1 = null;
    let selectTeacher2 = null;
    if (teachers && infoSelectedModule) {
      const { selectedTeacher1, selectedTeacher2 } = this.state;
      if (selectedTeacher1) {
        const teacher1 = this.filterTeacher(teachers, selectedTeacher1);
        selectTeacher1 = this.renderAssignedTeacher(teacher1, 1);
      } else {
        selectTeacher1 = this.renderSelectTeacher(1);
      }
      if (selectedTeacher2) {
        const teacher2 = this.filterTeacher(teachers, selectedTeacher2);
        selectTeacher2 = this.renderAssignedTeacher(teacher2, 2);
      } else {
        selectTeacher2 = this.renderSelectTeacher(2);
      }
    }
    return (
      <Modal
        visible={this.props.visible}
        closeModal={this.props.closeModal}
        title={title}
      >
        <div className={classes.formWrapper}>
          <label className={classes.label} htmlFor="teacher1">
            Teacher 1
          </label>
          {selectTeacher1}
          <label className={classes.label} htmlFor="teacher2">
            Teacher 2
          </label>
          {selectTeacher2}
          <div className={classes.btnWrapper}>
            <span>{this.state.warningMessage}</span>
            <div>
              <button
                className={`${classes.btn} ${classes.cancel}`}
                onClick={this.props.closeModal}
              >
                CANCEL
              </button>
              <button
                className={`${classes.btn} ${classes.ok}`}
                onClick={this.handleAssignTeahcers}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
