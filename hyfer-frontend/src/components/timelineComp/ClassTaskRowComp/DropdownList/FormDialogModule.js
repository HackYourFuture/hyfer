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

@inject('modulesStore', 'timeLineStore', 'currentModuleStore')
@observer
  export default withStyles(styles)(class FormDialogModule extends Component {
    state = {
      open: false,
      selectedModuleId: '',
      modules: [],
    };

    async getModules() {
      try {
        const token = localStorage.getItem('token');
        const data = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/modules`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
        });
        const modules = await data.json();
        this.setState({ modules });
      } catch (error) {
        console.log(error);
      }
    }

    componentWillMount = () => {
      this.getModules();
    };

    ComponentDidMount() {
      this.setState({
        open: this.props.open,
      });
    }

    handleClickOpen = () => {
      this.setState({ open: true });

    };

    handleClose = () => {
      this.setState({ open: false });
    };

    handleChangeSelectedModuleId = e => {
      this.setState({ selectedModuleId: e.target.value });
    };

    handleAddModule = async () => {
      try {
        const { selectedModuleId } = this.state;
        const { group_id, position } = this.props.currentModuleStore.currentModule;
        const token = localStorage.getItem('token');
        await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/running/add/${selectedModuleId}/${group_id}/${position + 1}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: 'Bearer ' + token,
            },
          });
        this.props.timeLineStore.fetchItems();
      } catch (error) {
        console.log(error);
      }
    };

    render() {
      const { classes } = this.props;

      return (<Fragment>
        <Dialog open={this.props.open}
          onClose={this.props.onClose}
        >
          <DialogTitle id="form-dialog-title">Add a new module</DialogTitle>
          <DialogContent>
            <form>
              <FormControl className={classes.formControl}>
                <ListItemText primary="Select Module" />
                <Select
                  value={this.state.selectedModuleId}
                  onChange={this.handleChangeSelectedModuleId}
                >
                  {this.state.modules.map(module => (
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
            <Button onClick={this.handleAddModule} color="inherit">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
      );
    }
  });

