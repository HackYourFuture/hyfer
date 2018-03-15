import React, { Component, Fragment } from 'react';

import RoundButton from '../../../Helpers/RoundButton/RoundButton';
import classes from './buttons.css';
import AddDropdownList from './AddDropdownList/AddDropdownList';

export default class Button extends Component {
  state = {
    isToggled: false
  };

  toggleDropdown = e => {
    this.setState({ isToggled: !this.state.isToggled });
  };

  render() {
    let addGroupBtn = null;
    const { isTeacher } = this.props;
    if (isTeacher) {
      addGroupBtn = (
        <Fragment>
          <RoundButton
            clickHandler={this.toggleDropdown}
            action="+"
            title="Add a class"
          />
          <AddDropdownList
            groupsWithIds={this.props.groupsWithIds}
            items={this.props.items}
            modules={this.props.modules}
            groups={this.props.groups}
            isToggled={this.state.isToggled}
          />
        </Fragment>
      );
    }
    return (
      <div className={classes.buttonsWrapper}>
        {addGroupBtn}
        <RoundButton
          clickHandler={this.props.clickHandler}
          action=">"
          title="Go to today"
        />
      </div>
    );
  }
}
