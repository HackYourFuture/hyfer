import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';

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
    const { running_module_id: runningId } = currentModuleStore.selectedModule;
    const { userId } = this.state;
    currentModuleStore.addTeacher(runningId, userId);
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
          <DialogTitle id="form-dialog-title">Add Teacher</DialogTitle>
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

AddTeacherDialog.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  userStore: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddTeacherDialog);
