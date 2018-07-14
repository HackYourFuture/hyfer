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
class AddTeacherDialog extends Component {

  state = {
    userId: -1,
  }

  componentDidMount() {
    this.props.userStore.getTeachers();
  }
  handleChange = (event) => {
    this.setState({ userId: event.target.value });
  }

  handleAddTeacher = async () => {
    this.props.onClose();
    const { currentModuleStore } = this.props;
    const { id } = currentModuleStore.currentModule;
    const { userId } = this.state;
    currentModuleStore.addTeacher(id, userId);
  };

  render() {
    const { classes, open, onClose } = this.props;
    if (this.props.userStore.teachers.length === 0) {
      return null;
    }

    return (
      <Fragment>
        <Dialog
          open={open}
          onClose={onClose}
        >
          <DialogTitle id="form-dialog-title">Add a Teacher</DialogTitle>
          <DialogContent>
            <form>
              <FormControl className={classes.formControl}>
                <ListItemText primary="Select a Teacher" />
                <Select
                  value={this.state.userId}
                  onChange={this.handleChange}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        transform: 'translate3d(0, 0, 0)',
                      },
                    },
                  }}>
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
            <Button
              color="inherit"
              onClick={this.props.onClose}
              aria-label="Close"
            >
              Cancel
            </Button>
            <Button
              onClick={this.handleAddTeacher}
              color="inherit"
              disabled={this.state.userId === -1}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

export default withStyles(styles)(AddTeacherDialog);
