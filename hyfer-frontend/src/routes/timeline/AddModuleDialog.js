import React, { Fragment, Component } from 'react';
import {
  Dialog, Select, DialogTitle,
  DialogContent, Button, ListItemText,
  MenuItem, FormControl, DialogActions,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { observer, inject } from 'mobx-react';

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 300,
  },
});

@inject('moduleStore', 'timeline', 'currentModuleStore')
@observer
class AddModuleDialog extends Component {
  state = {
    moduleId: -1,
  };

  handleAddModule = async () => {
    this.props.onClose();
    const { moduleId } = this.state;
    const { group_id, position } = this.props.currentModuleStore.currentModule;
    await this.props.timeline.addModule(moduleId, group_id, position + 1);
    this.props.timeline.fetchItems();
  };

  handleChange = (e) => this.setState({ moduleId: e.target.value });

  render() {
    const { classes, moduleStore } = this.props;
    const { modules } = moduleStore;
    if (modules.length === 0) {
      return null;
    }

    return (<Fragment>
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
      >
        <DialogTitle id="form-dialog-title">Add a new module</DialogTitle>
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
    </Fragment>
    );
  }
}

export default withStyles(styles)(AddModuleDialog);
