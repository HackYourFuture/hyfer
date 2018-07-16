import { inject, observer } from 'mobx-react';
import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import AddClassModal from './AddDropdownList/AddClassModal/AddClassModal';

const styles = () => ({
  buttonsWrapper: {
    marginRight: 50,
    zIndex: 3,
  },
  'buttonsWrapper > *': {
    marginTop: 5,
    display: 'inline-block',
  },
});

@inject('global')
@observer
class ClassButton extends Component {
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
    const { classes, global } = this.props;
    const { isTeacher } = global;
    let addGroupBtn = null;
    if (isTeacher) {
      addGroupBtn = (
        <Fragment>
          <Button
            onClick={this.openMenu}
            title="Add a class"
            variant="contained"
            color="secondary">
            ADD CLASS
          </Button>
          <AddClassModal
            open={this.state.isDialogOpen}
            onClose={this.closeMenu}          // isToggled={this.state.isToggled}
          />
        </Fragment>
      );
    }
    return (
      <div className={classes.buttonsWrapper}>
        {addGroupBtn}
        <Button
          onClick={this.props.clickHandler}
          variant="contained"
          title="Go to today"
        >Today</Button>
      </div>
    );
  }
}

export default withStyles(styles)(ClassButton);
