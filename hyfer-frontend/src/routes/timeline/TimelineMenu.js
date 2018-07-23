import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AddModuleDialog from './AddModuleDialog';

@inject('timelineStore', 'currentModuleStore', 'moduleStore', 'currentUserStore')
@observer
export default class TimelineMenu extends Component {
  state = {
    isDialogOpen: false,
  };

  openAddModuleDialog = () => {
    this.props.moduleStore.getModules();
    this.setState({ isDialogOpen: true });
    this.props.onClose();
  };

  closeAddModuleDialog = () => {
    this.setState({ isDialogOpen: false });
  };

  handleWeekLonger = (e) => {
    e.stopPropagation();
    this.props.onClose();
    const { selectedModule, group } = this.props.currentModuleStore;
    const { duration } = selectedModule;
    this.props.timelineStore.updateModule(selectedModule, group.id, duration + 1);
  };

  handleWeekShorter = (e) => {
    e.stopPropagation();
    this.props.onClose();
    const { selectedModule, group } = this.props.currentModuleStore;
    const { duration } = selectedModule;
    this.props.timelineStore.updateModule(selectedModule, group.id, duration - 1);
  };

  handleMoveLeft = (e) => {
    e.stopPropagation();
    this.props.onClose();
    const { selectedModule, group } = this.props.currentModuleStore;
    const { position, duration } = selectedModule;
    this.props.timelineStore.updateModule(selectedModule, group.id, duration, position - 1);
  };

  handleMoveRight = (e) => {
    e.stopPropagation();
    this.props.onClose();
    const { selectedModule, group } = this.props.currentModuleStore;
    const { position, duration } = selectedModule;
    this.props.timelineStore.updateModule(selectedModule, group.id, duration, position + 1);
  };

  handleRemoveModule = (e) => {
    e.stopPropagation();
    this.props.onClose();
    const { selectedModule, group } = this.props.currentModuleStore;
    this.props.timelineStore.removeModule(group.id, selectedModule.position);
  };

  handleSplitModule = async (e) => {
    e.stopPropagation();
    this.props.onClose();
    const { selectedModule, group } = this.props.currentModuleStore;
    this.props.timelineStore.splitModule(group.id, selectedModule.position);
  };

  render() {
    const { anchorEl, onClose, currentModuleStore, runningModuleId } = this.props;
    const { selectedModule } = currentModuleStore;

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
          <MenuItem onClick={this.handleRemoveModule}>Remove</MenuItem>
          <MenuItem onClick={this.openAddModuleDialog}>Insert module</MenuItem>
        </Menu>
        <AddModuleDialog
          onClose={this.closeAddModuleDialog}
          open={this.state.isDialogOpen}
        />
      </Fragment>
    );
  }
}

TimelineMenu.wrappedComponent.propTypes = {
  anchorEl: PropTypes.object,
  currentModuleStore: PropTypes.object.isRequired,
  isLast: PropTypes.bool.isRequired,
  moduleStore: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  runningModuleId: PropTypes.number.isRequired,
  timelineStore: PropTypes.object.isRequired,
};

TimelineMenu.wrappedComponent.defaultProps = {
  isLast: false,
};

