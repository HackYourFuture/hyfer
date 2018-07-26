import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AddModuleDialog from './AddModuleDialog';
import ConfirmationDialog from '../../components/ConfirmationDialog';

@inject('timeline', 'currentModule', 'modulesStore', 'currentUser')
@observer
export default class TimelineMenu extends Component {
  state = {
    addModuleDialogOpen: false,
    confirmationDialogOpen: false,
  };

  openAddModuleDialog = () => {
    this.props.modulesStore.getModules();
    this.setState({ addModuleDialogOpen: true });
    this.props.onClose();
  };

  closeAddModuleDialog = () => {
    this.setState({ addModuleDialogOpen: false });
  };

  handleWeekLonger = (e) => {
    e.stopPropagation();
    this.props.onClose();
    const { selectedModule, group } = this.props.currentModule;
    const { duration } = selectedModule;
    this.props.timeline.updateModule(selectedModule, group.id, duration + 1);
  };

  handleWeekShorter = (e) => {
    e.stopPropagation();
    this.props.onClose();
    const { selectedModule, group } = this.props.currentModule;
    const { duration } = selectedModule;
    this.props.timeline.updateModule(selectedModule, group.id, duration - 1);
  };

  handleMoveLeft = (e) => {
    e.stopPropagation();
    this.props.onClose();
    const { selectedModule, group } = this.props.currentModule;
    const { position, duration } = selectedModule;
    this.props.timeline.updateModule(selectedModule, group.id, duration, position - 1);
  };

  handleMoveRight = (e) => {
    e.stopPropagation();
    this.props.onClose();
    const { selectedModule, group } = this.props.currentModule;
    const { position, duration } = selectedModule;
    this.props.timeline.updateModule(selectedModule, group.id, duration, position + 1);
  };

  handleRemoveModule = (e) => {
    e.stopPropagation();
    this.closeConfirmationDialog();
    const { selectedModule, group } = this.props.currentModule;
    this.props.currentModule.clearSelectedModule();
    this.props.timeline.removeModule(group.id, selectedModule.position);
  };

  handleSplitModule = async (e) => {
    e.stopPropagation();
    this.props.onClose();
    const { selectedModule, group } = this.props.currentModule;
    this.props.timeline.splitModule(group.id, selectedModule.position);
  };

  openConfirmationDialog = () => {
    this.props.onClose();
    this.setState({ confirmationDialogOpen: true });
  };

  closeConfirmationDialog = () => {
    this.setState({ confirmationDialogOpen: false });
  };

  render() {
    const { anchorEl, onClose, currentModule, runningModuleId } = this.props;
    const { selectedModule } = currentModule;

    if (!selectedModule || selectedModule.running_module_id !== runningModuleId) {
      return null;
    }

    return (
      <Fragment>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={onClose}
        >
          <MenuItem
            onClick={this.handleWeekLonger}
          >
            Week longer
          </MenuItem>
          <MenuItem
            onClick={this.handleWeekShorter}
            disabled={selectedModule.duration <= 1}
          >
            Week shorter
          </MenuItem>
          <MenuItem
            onClick={this.handleMoveRight}
            disabled={this.props.isLast}
          >
            Move right
          </MenuItem>
          <MenuItem
            onClick={this.handleMoveLeft}
            disabled={selectedModule.position === 0}
          >
            Move left
          </MenuItem>
          <MenuItem
            onClick={this.handleSplitModule}
            disabled={selectedModule.duration <= 1}
          >
            Split
          </MenuItem>
          <MenuItem onClick={this.openConfirmationDialog}>Remove</MenuItem>
          <MenuItem onClick={this.openAddModuleDialog}>Insert module</MenuItem>
        </Menu>
        <AddModuleDialog
          onClose={this.closeAddModuleDialog}
          open={this.state.addModuleDialogOpen}
        />
        <ConfirmationDialog
          open={this.state.confirmationDialogOpen}
          title="Delete Module"
          message="Are you sure you wish to delete this module?"
          onOk={this.handleRemoveModule}
          onCancel={this.closeConfirmationDialog}
        />
      </Fragment>
    );
  }
}

TimelineMenu.wrappedComponent.propTypes = {
  anchorEl: PropTypes.object,
  currentModule: PropTypes.object.isRequired,
  isLast: PropTypes.bool.isRequired,
  modulesStore: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  runningModuleId: PropTypes.number.isRequired,
  timeline: PropTypes.object.isRequired,
};

TimelineMenu.wrappedComponent.defaultProps = {
  isLast: false,
};

