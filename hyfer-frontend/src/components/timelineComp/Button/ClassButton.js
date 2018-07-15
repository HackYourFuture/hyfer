import { inject, observer } from 'mobx-react';
import React, { Component, Fragment } from 'react';
//import RoundButton from '../../../Helpers/RoundButton/RoundButton';
import AddDropdownList from './AddDropdownList/AddDropdownList';
import classes from './button.css';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

@inject('global')
@observer
export default class ClassButton extends Component {
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

          <Button
            onClick={this.toggleDropdown}
            mini
            title="Add a class"
            variant="fab" color="secondary" aria-label="edit">
            <AddIcon />
          </Button>
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
        <Button
          onClick={this.props.clickHandler}
          color="secondary"
          title="Go to today"
        >Today</Button>
      </div>
    );
  }
}
