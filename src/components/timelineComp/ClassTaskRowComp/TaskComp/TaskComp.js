import React, { Component } from 'react';

import DropdownList from '../DropdownList/DropdownList';
import classes from './taskComp.css';
import AssignTeacherModal from '../DropdownList/AssignTeacherModal/AssignTeacherModal';
import { timelineStore } from '../../../../store';

export default class TaskComp extends Component {
  state = {
    assignTeacherModalIsToggled: false,
    dontChangeSelectedItem: false
  };

  showAssignTeacherModal = e => {
    e.stopPropagation();
    this.setState({ assignTeacherModalIsToggled: true });
  };

  hideAssignTeacherModal = () => {
    this.setState({ assignTeacherModalIsToggled: false });
  };

  handleClickItem = e => {
    const { item } = this.props;
    this.props.itemClickHandler(e, item);
  };

  render() {
    const {
      module_name,
      starting_date,
      ending_date,
      duration,
      color,
      git_repo,
      running_module_id,
      id,
      group_name
    } = this.props.item;
    let { width, height, active } = this.props;
    if (duration > 1) {
      // add extra times width as much as needed but for the margin add all - 1 (for the first item it doesn't need any margin)
      width = width * duration + 16 * (duration - 1);
    }
    let className = classes.flexWrapper;
    if (active) className += ` ${classes.active}`;

    let dropdownList = null;
    if (
      this.props.selectedModule &&
      this.props.selectedModule.running_module_id ===
        this.props.item.running_module_id
    ) {
      dropdownList = (
        <div className={classes.dropdownListContainer}>
          <DropdownList
            isTeacher={this.props.isTeacher}
            showModal={this.showAssignTeacherModal}
            selectedModule={this.props.selectedModule}
            allModules={this.props.allModules}
          />
        </div>
      );
    }
    const theStart = starting_date.clone();
    theStart.add(2, 'hours');

    return (
      <div>
        <AssignTeacherModal
          teachers={this.props.teachers}
          infoSelectedModule={this.props.infoSelectedModule}
          visible={this.state.assignTeacherModalIsToggled}
          selectedModule={this.props.selectedModule}
          assignTeachersFunc={timelineStore.handleAssignTeachers}
          closeModal={this.hideAssignTeacherModal}
        />
        <div
          className={classes.container}
          style={{ width: width + 'px', height: height + 'px' }}
        >
          <div
            className={className}
            style={{ backgroundColor: color }}
            title={module_name}
            data-repo={git_repo}
            data-group={group_name}
            data-module_name={module_name}
            data-start={starting_date.toString()}
            data-end={ending_date.toString()}
            data-duration={duration}
            data-group_id={id}
            data-running_module_id={running_module_id}
            onClick={this.handleClickItem}
          >
            <div className="taskComp__inner">
              <p className="taskComp__info">{module_name}</p>
              <p className={classes.dates + ' taskComp__info'}>
                {theStart.format('DD MMMM')} - {ending_date.format('DD MMMM')}
              </p>
            </div>

            {dropdownList}
          </div>
        </div>
      </div>
    );
  }
}
