import React, { Component } from 'react';

import classes from './dropdownList.css';
import Dropdown from '../../../../Helpers/Dropdown/Dropdown';
import RoundButton from '../../../../Helpers/RoundButton/RoundButton';
import deleteCross from './icons/delete.svg';
import rightArrow1 from './icons/rightArrow1.svg';
import rightArrow2 from './icons/rightArrow2.svg';
import leftArrow1 from './icons/leftArrow1.svg';
import leftArrow2 from './icons/leftArrow2.svg';
import graduateCap from './icons/graduateCap.svg';

// import { timelineStore } from '../../../../store';

import { inject, observer } from 'mobx-react';

@inject('timeLineStore', 'global')
@observer
export default class DropdownList extends Component {
  state = {
    isToggled: false,
  };

  toggleDropdown = e => {
    e.stopPropagation();
    this.setState({ isToggled: !this.state.isToggled });

    // setting state is asynchronous
    setTimeout(() => {
      const timelineBottom = document
        .querySelector('.rootContainer')
        .getClientRects()[0].bottom;
      const dropdownList = document.querySelector(`.${classes.dropdown}`);
      const dropdownListBottom = dropdownList.getClientRects()[0].bottom;
      if (dropdownListBottom > timelineBottom) {
        dropdownList.style.top =
          -(dropdownListBottom - timelineBottom + 20) + 'px';
      }
    }, 0);
  };

  updateModule(module, action) {
    const { groups } = this.props.timeLineStore;
    let result = null;
    switch (action) {
      case 'weekLonger':
        result = this.weekLonger(module);
        break;
      case 'removeModule':
        result = this.props.timeLineStore.removeModule(module);
        break;
      case 'weekShorter':
        result = this.weekShorter(module, groups);
        break;
      case 'moveLeft':
        result = this.moveLeft(module, groups);
        break;
      case 'moveRight':
        result = this.moveRight(module, groups);
        break;
      default:
        break;
    }
    result
      .then(() => {
        return this.props.timeLineStore.fetchItems();
      }) // catching it here so we don't need to catch it any more especially it's switch cases
      .catch((error) => { throw new Error(error); });

  }

  handleWeekLonger = e => {
    e.stopPropagation();
    const { selectedModule } = this.props;
    this.updateModule(selectedModule, 'weekLonger');
  };

  handleWeekShorter = e => {
    e.stopPropagation();
    const { selectedModule } = this.props;
    this.updateModule(selectedModule, 'weekShorter');
  };

  handleMoveLeft = e => {
    e.stopPropagation();

    const { selectedModule } = this.props;
    this.updateModule(selectedModule, 'moveLeft');
  };

  handleMoveRight = e => {
    e.stopPropagation();

    const { selectedModule } = this.props;
    this.updateModule(selectedModule, 'moveRight');
  };

  handleRemoveModule = e => {
    e.stopPropagation();

    const { selectedModule } = this.props;
    this.updateModule(selectedModule, 'removeModule');
  };

  weekLonger(chosenModule) {
    const { duration } = chosenModule;
    const newDuration = duration + 1;
    const groupId = chosenModule.id;
    return this.props.timeLineStore.patchGroupsModules(
      chosenModule,
      null,
      newDuration,
      null,
      null,
      groupId
    );
  }

  weekShorter(chosenModule) {
    const { duration } = chosenModule;
    const newDuration = duration - 1;
    const groupId = chosenModule.id;

    return this.props.timeLineStore.patchGroupsModules(
      chosenModule,
      null,
      newDuration,
      null,
      null,
      groupId
    );
  }

  moveRight(chosenModule) {
    const { position, duration } = chosenModule;
    const newPosition = position + 1;
    const groupId = chosenModule.id;
    console.log(groupId, newPosition);

    return this.props.timeLineStore.patchGroupsModules(
      chosenModule,
      newPosition,
      duration,
      null,
      null,
      groupId
    );
  }

  moveLeft(chosenModule) {
    const { position, duration } = chosenModule;
    const newPosition = position - 1;
    const groupId = chosenModule.id;

    return this.props.timeLineStore.patchGroupsModules(
      chosenModule,
      newPosition,
      duration,
      null,
      null,
      groupId
    );
  }

  checkModuleIsLast = () => {
    const { position, group_name } = this.props.selectedModule;
    const classModules = this.props.allModules.filter(
      module => module.group_name === group_name
    );
    const itemsAfter = classModules.filter(item => item.position > position);
    return itemsAfter.length === 0;
  };

  render() {
    let moveLeft = this.handleMoveLeft;
    let moveRight = this.handleMoveRight;
    let rightDisableClass = null;
    let leftDisableClass = null;
    if (this.props.selectedModule.position === 0) {
      moveLeft = null;
      leftDisableClass = classes.disabled;
    }

    if (this.checkModuleIsLast()) {
      moveRight = null;
      rightDisableClass = classes.disabled;
    }

    if (!this.props.global.isTeacher) {
      return null;
    }

    return (
      <div>
        <RoundButton
          clickHandler={this.toggleDropdown}
          action="..."
          title="more info"
          className={classes.dropdownToggeler}
        />
        <Dropdown isToggled={this.state.isToggled} className={classes.dropdown}>
          <ul>
            <li onClick={moveRight}>
              <span className={classes.listItem + ' ' + rightDisableClass}>
                <span className={classes.symbol}>
                  <img src={rightArrow1} alt="rightArrow1 icon" />
                </span>
                <span>Move right</span>
              </span>
            </li>
            <li onClick={moveLeft}>
              <span className={classes.listItem + ' ' + leftDisableClass}>
                <span className={classes.symbol}>
                  <img src={leftArrow1} alt="leftArrow1 icon" />
                </span>
                <span>Move left</span>
              </span>
            </li>
            <li onClick={this.handleWeekLonger}>
              <span className={classes.listItem}>
                <span className={classes.symbol}>
                  <img src={rightArrow2} alt="rightArrow2 icon" />
                </span>
                <span>Week longer</span>
              </span>
            </li>
            <li onClick={this.handleWeekShorter}>
              <span className={classes.listItem}>
                <span className={classes.symbol}>
                  <img src={leftArrow2} alt="leftArrow2 icon" />
                </span>
                <span>Week shorter</span>
              </span>
            </li>
            <li onClick={this.props.showModal}>
              <span className={classes.listItem}>
                <span className={classes.symbol}>
                  <img src={graduateCap} alt="graduateCap icon" />
                </span>
                <span>(Re)assign teachers</span>
              </span>
            </li>
            <li onClick={this.handleRemoveModule}>
              <span className={classes.listItem}>
                <span className={classes.symbol}>
                  <img src={deleteCross} alt="delete icon" />
                </span>
                <span>Remove module</span>
              </span>
            </li>
          </ul>
        </Dropdown>
      </div>
    );
  }
}
