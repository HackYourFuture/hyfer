import { inject, observer } from 'mobx-react';
import React, { Component, Fragment } from 'react';
//import RoundButton from '../../../Helpers/RoundButton/RoundButton';
//import AddDropdownList from './AddDropdownList/AddDropdownList';
import classes from './button.css';
import { Button } from '@material-ui/core';
import AddClassModal from './AddDropdownList/AddClassModal/AddClassModal';


@inject('global')
@observer
export default class ClassButton extends Component {
  state = {
    isDialogOpen: false,
  };

  openMenu = () => {
    this.setState({ isDialogOpen: true });
  };

  closeMenu = () => {
    this.setState({ isDialogOpen: false });
  };

  render() {
    let addGroupBtn = null;
    const { isTeacher } = this.props.global;
    if (isTeacher) {
      addGroupBtn = (
        <Fragment>
          <Button
            onClick={this.openMenu}
            // className={classes.btn}
            title="Add a class"
            color="secondary">
            ADD CLASS
          </Button>
          <AddClassModal
            open={this.state.isDialogOpen}
            onClose={this.closeMenu}
          // isToggled={this.state.isToggled}
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
