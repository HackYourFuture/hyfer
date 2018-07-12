import React, { Fragment, Component } from 'react';
import {
  Dialog, Select, DialogTitle,
  DialogContent, Button,
  MenuItem, FormControl, DialogActions,
  // FormControlLabel,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { observer, inject } from 'mobx-react';

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 300,
  },
});


@inject('userStore', 'currentModuleStore')
@observer
class AssignTeacherDialog extends Component {

  state = {
    userId: 0,
  }

  handleChange = (event) => {
    this.setState({ userId: event.target.value });
  }

  handleAddTeacher = () => {
    const { id } = this.props.currentModuleStore.currentModule;
    console.log(this.state.userId, id);
    this.props.onClose();
  }

  // TODO: Arrange teachers alphabetically,
  //FilterTeacher that are already assigned, ==>Inclined to do it, it is a dumb thing to do.
  //backend: add a teacher for this running module==> Done
  //backend: get the teachers that are assinged to the currently selected module==>doen

  render() {
    const { classes } = this.props;
    if (this.props.userStore.teachers.length === 0) {
      return null;
    }
    return (
      <Fragment>
        <Dialog
          open={this.props.open}
          onClose={this.props.onClose}
        >
          <DialogTitle id="form-dialog-title">Add a Teacher</DialogTitle>
          <DialogContent>
            <form>
              <FormControl className={classes.formControl}>
                {/* <FormControlLabel primary="Select Teacher" /> */}
                <Select
                  value={this.state.userId}
                  onChange={this.handleChange}
                >
                  {this.props.userStore.teachers.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.full_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button color="inherit" onClick={this.props.onClose} aria-label="Close">
              Cancel
              </Button>
            <Button onClick={this.handleAddTeacher} color="inherit">
              Add
              </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

export default withStyles(styles)(AssignTeacherDialog);
