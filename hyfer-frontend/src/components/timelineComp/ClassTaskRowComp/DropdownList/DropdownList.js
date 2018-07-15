import React, { Fragment, Component } from 'react';
import AddModuleDialog from './AddModuleDialog';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { inject, observer } from 'mobx-react';

@inject('timeLineStore', 'modulesStore', 'global')
@observer
export default class DropdownList extends Component {
  state = {
    anchorEl: null,
    isDialogOpen: false,
  };

  openMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  closeMenu = () => {
    this.setState({ anchorEl: null });
  };

  openAddModuleDialog = () => {
    this.props.modulesStore.getModules();
    this.setState({ isDialogOpen: true });
    this.closeMenu();
  };

  closeAddModuleDialog = () => {
    this.setState({ isDialogOpen: false });
  };

  handleWeekLonger = (e) => {
    e.stopPropagation();
    this.closeMenu();
    const { selectedModule } = this.props;
    const { duration } = selectedModule;
    this.props.timeLineStore.updateModule(selectedModule, null, duration + 1);
  };

  handleWeekShorter = (e) => {
    e.stopPropagation();
    this.closeMenu();
    const { selectedModule } = this.props;
    const { duration } = selectedModule;
    this.props.timeLineStore.updateModule(selectedModule, null, duration - 1);
  };

  handleMoveLeft = (e) => {
    e.stopPropagation();
    this.closeMenu();
    const { selectedModule } = this.props;
    const { position, duration } = selectedModule;
    this.props.timeLineStore.updateModule(selectedModule, position - 1, duration);
  };

  handleMoveRight = (e) => {
    e.stopPropagation();
    this.closeMenu();
    const { selectedModule } = this.props;
    const { position, duration } = selectedModule;
    this.props.timeLineStore.updateModule(selectedModule, position + 1, duration);
  };

  handleRemoveModule = (e) => {
    e.stopPropagation();
    this.closeMenu();
    const { group_id, position } = this.props.selectedModule;
    this.props.timeLineStore.removeModule(group_id, position);
  };

  handleSplitModule = async (e) => {
    e.stopPropagation();
    this.closeMenu();
    const { group_id, position } = this.props.selectedModule;
    this.props.timeLineStore.splitModule(group_id, position);
  };

  render() {
    const { anchorEl } = this.state;
    const { selectedModule } = this.props;

    if (!this.props.global.isTeacher) {
      return null;
    }

    return (
      <Fragment>
        <IconButton
          aria-owns={anchorEl ? 'long-menu' : null}
          aria-haspopup="true"
          onClick={this.openMenu}
        >
          <AddModuleDialog open={false} />
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.closeMenu}
        >
          <MenuItem onClick={this.handleWeekLonger}>Week longer</MenuItem>
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
