/* eslint react/prop-types: error */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import DropdownList from '../DropdownList/DropdownList';
import classes from './taskComp.css';
//import AssignTeacherModal from '../DropdownList/AssignTeacherModal/AssignTeacherModal';

@inject('currentModuleStore', 'userStore')
@observer
export default class TaskComp extends Component {
  state = {
    assignTeacherModalIsToggled: false,
    dontChangeSelectedItem: false,
  };

  showAssignTeacherModal = e => {
    e.stopPropagation();
    this.props.userStore.getTeacher();
    this.setState({ assignTeacherModalIsToggled: true });
  };

  hideAssignTeacherModal = () => {
    this.setState({ assignTeacherModalIsToggled: false });
  };

  itemClickHandler = (item) => {
    this.props.currentModuleStore.getRunningModuleDetails(item.running_module_id);
  };

  render() {
    const {
      module_name,
      starting_date,
      ending_date,
      duration,
      color,
    } = this.props.item;

    let { width } = this.props;
    if (duration > 1) {
      // add extra times width as much as needed but for the margin add all - 1 (for the first item it doesn't need any margin)
      width = width * duration + 16 * (duration - 1);
    }

    let className = classes.flexWrapper;

    const { currentModule } = this.props.currentModuleStore;
    let dropdownList = null;
    if (currentModule && currentModule.id === this.props.item.running_module_id) {
      className += ` ${classes.active}`;
      dropdownList = (
        <div className={classes.dropdownListContainer}>
          <DropdownList
            showModal={this.showAssignTeacherModal}
            selectedModule={currentModule}
            isLast={this.props.isLast}
          />
        </div>
      );
    }

    return (
      <div>
        <div
          className={classes.container}
          style={{ width: width + 'px', height: this.props.height + 'px' }}
        >
          <div
            className={className}
            style={{ backgroundColor: color }}
            title={module_name}
            onClick={() => this.itemClickHandler(this.props.item)}
          >
            <div className="taskComp__inner">
              <p className="taskComp__info">{module_name}</p>
              <p className={classes.dates + ' taskComp__info'}>
                {starting_date.format('DD MMM')} - {ending_date.format('DD MMM')}
              </p>
            </div>

            {dropdownList}
          </div>
        </div>
      </div >
    );
  }
}

TaskComp.wrappedComponent.propTypes = {
  currentModuleStore: PropTypes.object.isRequired,
  userStore: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  isLast: PropTypes.bool.isRequired,
};
