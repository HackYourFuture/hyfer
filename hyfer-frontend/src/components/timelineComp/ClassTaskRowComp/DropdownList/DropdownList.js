import React, { Fragment, Component } from 'react';
import FormDialogModule from './FormDialogModule';// eslint-disable-line no-unused-vars
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FastForward from '@material-ui/icons/FastForward';
import FastRewind from '@material-ui/icons/FastRewind';
import ArrowForward from '@material-ui/icons/ArrowForward';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Split from '@material-ui/icons/SwapHoriz';
import Remove from '@material-ui/icons/Remove';
import Add from '@material-ui/icons/Add';
import { inject, observer } from 'mobx-react';

@inject('timeLineStore', 'global')
@observer
export default class DropdownList extends Component {
  state = {
    isToggled: false,
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  updateModule(module, action) {
    const { groups } = this.props.timeLineStore;
    let result = null;
    switch (action) {
      case 'weekLonger':
        result = this.weekLonger(module);
        break;
      case 'removeModule':
        result = this.props.timeLineStore.removeModule(module);
        break;
      case 'weekShorter':
        result = this.weekShorter(module, groups);
        break;
      case 'moveLeft':
        result = this.moveLeft(module, groups);
        break;
      case 'moveRight':
        result = this.moveRight(module, groups);
        break;
      default:
        break;
    }
    result
      .then(() => {
        return this.props.timeLineStore.fetchItems();
      }) // catching it here so we don't need to catch it any more especially it's switch cases
      .catch((error) => { throw new Error(error); });

  }

  handleWeekLonger = e => {
    e.stopPropagation();
    const { selectedModule } = this.props;
    this.updateModule(selectedModule, 'weekLonger');
  };

  handleWeekShorter = e => {
    e.stopPropagation();
    const { selectedModule } = this.props;
    this.updateModule(selectedModule, 'weekShorter');
  };

  handleMoveLeft = e => {
    e.stopPropagation();

    const { selectedModule } = this.props;
    this.updateModule(selectedModule, 'moveLeft');
  };

  handleMoveRight = e => {
    e.stopPropagation();

    const { selectedModule } = this.props;
    this.updateModule(selectedModule, 'moveRight');
  };

  handleRemoveModule = e => {
    e.stopPropagation();

    const { selectedModule } = this.props;
    this.updateModule(selectedModule, 'removeModule');
  };

  weekLonger(chosenModule) {
    const { duration } = chosenModule;
    const newDuration = duration + 1;
    const groupId = chosenModule.id;
    return this.props.timeLineStore.patchGroupsModules(
      chosenModule,
      null,
      newDuration,
      null,
      null,
      groupId
    );
  }

  weekShorter(chosenModule) {
    const { duration } = chosenModule;
    const newDuration = duration - 1;
    const groupId = chosenModule.id;

    return this.props.timeLineStore.patchGroupsModules(
      chosenModule,
      null,
      newDuration,
      null,
      null,
      groupId
    );
  }

  moveRight(chosenModule) {
    const { position, duration } = chosenModule;
    const newPosition = position + 1;
    const groupId = chosenModule.id;
    console.log(groupId, newPosition);

    return this.props.timeLineStore.patchGroupsModules(
      chosenModule,
      newPosition,
      duration,
      null,
      null,
      groupId
    );
  }

  moveLeft(chosenModule) {
    const { position, duration } = chosenModule;
    const newPosition = position - 1;
    const groupId = chosenModule.id;
  
    return this.props.timeLineStore.patchGroupsModules(
      chosenModule,
      newPosition,
      duration,
      null,
      null,
      groupId
    );
  }

  checkModuleIsLast = () => {
    const { position, group_name } = this.props.selectedModule;
    const classModules = this.props.allModules.filter(
      module => module.group_name === group_name
    );
    const itemsAfter = classModules.filter(item => item.position > position);
    return itemsAfter.length === 0;
  };
  
  render() {
    const { anchorEl } = this.state;
    let moveLeft = this.handleMoveLeft;
    let moveRight = this.handleMoveRight;
    if (this.props.selectedModule.position === 0) {
      moveLeft = null;
    }
    if (this.checkModuleIsLast()) {
      moveRight = null;
    }
    if (!this.props.global.isTeacher) {
      return null;
    }
    return (
      <Fragment>
        <IconButton
        aria-owns={anchorEl ? 'long-menu' : null}
        aria-haspopup="true"
        onClick={this.handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          >
            <MenuItem >
              <ListItemIcon ><ArrowForward /></ListItemIcon>
              <ListItemText inset primary="Move right" onClick={moveRight} />
            </MenuItem>
            <MenuItem >
              <ListItemIcon ><ArrowBack /></ListItemIcon>
              <ListItemText inset primary="Move left" onClick={moveLeft} />
            </MenuItem>
            <MenuItem >
              <ListItemIcon ><FastForward /></ListItemIcon>
              <ListItemText inset primary="Week longer" onClick={this.handleWeekLonger} />
            </MenuItem>
            <MenuItem >
              <ListItemIcon ><FastRewind /></ListItemIcon>
              <ListItemText inset primary="Week shorter" onClick={this.handleWeekShorter} />
            </MenuItem>
            <MenuItem >
              <ListItemIcon ><Split /></ListItemIcon>
              <ListItemText inset primary="Split Module" onClick={()=>{}} />
            </MenuItem>
            <MenuItem >
              <ListItemIcon ><Remove /></ListItemIcon>
              <ListItemText inset primary="Remove module" onClick={this.handleRemoveModule} />
            </MenuItem>
            <MenuItem >
              <ListItemIcon ><Add /></ListItemIcon>
              <ListItemText inset primary="Add a new module" onClick={this.FormDialogModule} />
            </MenuItem>
        </Menu>
      </Fragment>
    );
  }
}
