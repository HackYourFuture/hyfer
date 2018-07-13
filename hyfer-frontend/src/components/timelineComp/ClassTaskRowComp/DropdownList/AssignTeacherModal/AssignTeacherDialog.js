import React, { Fragment, Component } from 'react';
import {
  Dialog, Select, DialogTitle,
  DialogContent, Button,
  MenuItem, FormControl, DialogActions,
  ListItemText,
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

  handleAddTeacher = async () => {
    try {
      const { id } = this.props.currentModuleStore.currentModule;
      const teacher_id = this.state.userId;
      const token = localStorage.getItem('token');
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/teachers/${id}/${teacher_id}`,
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
    } catch (error) {
      console.log(error);
    }
    this.props.onClose();
  };

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
                <ListItemText primary="Select a Teacher" />
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
