import { inject, observer } from 'mobx-react';
import React, { Component, Fragment } from 'react';
import RoundButton from '../../../Helpers/RoundButton/RoundButton';
import AddDropdownList from './AddDropdownList/AddDropdownList';
import classes from './button.css';

@inject('global')
@observer
export default class Button extends Component {
  state = {
    isToggled: false,
  };

  toggleDropdown = () => {
    this.setState({ isToggled: !this.state.isToggled });
  };

  render() {
    let addGroupBtn = null;
    const { isTeacher } = this.props.global;
    if (isTeacher) {
      addGroupBtn = (
        <Fragment>
          <RoundButton
            clickHandler={this.toggleDropdown}
            action="+"
            title="Add a class"
          />
          <AddDropdownList
            items={this.props.items}
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
