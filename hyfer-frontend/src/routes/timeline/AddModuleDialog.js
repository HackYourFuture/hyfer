import React from 'react';
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

@inject('modulesStore', 'timeline', 'currentModule')
@observer
class AddModuleDialog extends React.Component {
  state = {
    moduleId: -1,
  };

  handleAddModule = async () => {
    this.props.onClose();
    const { moduleId } = this.state;
    const { id: groupId } = this.props.currentModule.group;
    const { position } = this.props.currentModule.selectedModule;
    await this.props.timeline.addModule(moduleId, groupId, position + 1);
  };

  handleChange = (e) => this.setState({ moduleId: e.target.value });

  render() {
    const { classes, modulesStore } = this.props;
    const { modules } = modulesStore;
    if (modules.length === 0) {
      return null;
    }

    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
      >
        <DialogTitle id="form-dialog-title">Add New Module</DialogTitle>
        <DialogContent>
          <form>
            <FormControl className={classes.formControl}>
              <ListItemText primary="Select Module" />
              <Select
                value={this.state.moduleId}
                onChange={this.handleChange}
              >
                {modules.map(module => (
                  <MenuItem key={module.module_name} value={module.id}>
                    {module.module_name}
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
          <Button
            onClick={this.handleAddModule}
            color="inherit"
            disabled={this.state.moduleId === -1}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

AddModuleDialog.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentModule: PropTypes.object.isRequired,
  modulesStore: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  timeline: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddModuleDialog);
