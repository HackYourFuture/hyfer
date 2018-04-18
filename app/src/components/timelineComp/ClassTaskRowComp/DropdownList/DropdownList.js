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

import { timelineStore } from '../../../../store';

export default class DropdownList extends Component {
  state = {
    isToggled: false
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

  weekLonger = e => {
    e.stopPropagation();
    const { selectedModule } = this.props;
    timelineStore.updateModule(selectedModule, 'weekLonger');
  };

  weekShorter = e => {
    e.stopPropagation();
    const { selectedModule } = this.props;
    timelineStore.updateModule(selectedModule, 'weekShorter');
  };

  moveLeft = e => {
    e.stopPropagation();

    const { selectedModule } = this.props;
    timelineStore.updateModule(selectedModule, 'moveLeft');
  };

  moveRight = e => {
    e.stopPropagation();

    const { selectedModule } = this.props;
    timelineStore.updateModule(selectedModule, 'moveRight');
  };

  checkModuleIsLast = () => {
    const { position, group_name } = this.props.selectedModule;
    const classModules = this.props.allModules.filter(
      module => module.group_name === group_name
    );
    const itemsAfter = classModules.filter(item => item.position > position);
    return itemsAfter.length === 0;
  };

  removeModule = e => {
    e.stopPropagation();

    const { selectedModule } = this.props;
    timelineStore.updateModule(selectedModule, 'removeModule');
  };

  render() {
    let moveLeft = this.moveLeft;
    let moveRight = this.moveRight;
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

    if (!this.props.isTeacher) {
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
            <li onClick={this.weekLonger}>
              <span className={classes.listItem}>
                <span className={classes.symbol}>
                  <img src={rightArrow2} alt="rightArrow2 icon" />
                </span>
                <span>Week longer</span>
              </span>
            </li>
            <li onClick={this.weekShorter}>
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
            <li onClick={this.removeModule}>
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
