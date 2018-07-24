import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import SelectClassDialog from './SelectClassDialog';
import AddClassDialog from './AddClassDialog';
import { CLASS_SELECTION_CHANGED } from '../../../stores';

const styles = (theme) => ({
  select: {
    margin: theme.spacing.unit,
    textAlign: 'right',
  },
  menuItem: {
    justifyContent: 'center',
  },
});

@inject('timelineStore', 'currentUserStore', 'currentModuleStore')
@observer
class ClassMenu extends Component {
  state = {
    addClassDialogOpen: false,
    selectClassDialogOpen: false,
  };

  openMenu = () => {
    this.setState({ addClassDialogOpen: true });
  };

  closeAddClassDialog = () => {
    this.setState({ addClassDialogOpen: false });
  };

  closeSelectClassDialog = () => {
    this.setState({ selectClassDialogOpen: false });
  };

  selectClass = async (groupName) => {
    this.closeSelectClassDialog();
    this.props.timelineStore.setFilter(groupName);
    await this.props.timelineStore.fetchTimeline();
    if (groupName !== 'active') {
      await this.props.currentModuleStore.getGroupsByGroupName(groupName);
    } else {
      await this.props.currentModuleStore.clearSelectedModule();
    }
    this.props.timelineStore.notify(CLASS_SELECTION_CHANGED, groupName);
  }

  addClass = async ({ classNumber, startingDate }) => {
    this.closeAddClassDialog();
    await this.props.timelineStore.addNewClass(`class${classNumber}`, startingDate.toISOString());
    this.props.timelineStore.fetchTimeline();
  };

  handleChange = (event) => {
    const { value } = event.target;
    if (value === 'add') {
      this.setState({ addClassDialogOpen: true });
    }
    else if (value === 'archived') {
      this.setState({ selectClassDialogOpen: true });
    } else {
      this.selectClass(value);
    }
  };

  renderMenuItems() {
    const { classes } = this.props;
    const { groups } = this.props.timelineStore;
    return groups
      .filter(group => group.archived === 0)
      .map(group => {
        const number = group.group_name.match(/(\d+)$/)[1];
        return <MenuItem
          key={number}
          value={group.group_name}
          classes={{ root: classes.menuItem }}
        >
          {number}
        </MenuItem>;
      });
  }

  render() {
    const { classes, currentUserStore } = this.props;
    return (
      <React.Fragment>
        <Select
          value={this.props.timelineStore.filter}
          onChange={this.handleChange}
          classes={{ root: classes.select }}
          MenuProps={{
            PaperProps: {
              style: {
                transform: 'translate3d(0, 0, 0)',
              },
            },
          }}
        >
          <MenuItem value='active' classes={{ root: classes.menuItem }}>All</MenuItem>
          <Divider />
          {this.renderMenuItems()}
          <Divider />
          <MenuItem value='archived' classes={{ root: classes.menuItem }}>Archived</MenuItem>
          {currentUserStore.isTeacher && <Divider />}
          {currentUserStore.isTeacher && (
            <MenuItem value="add" classes={{ root: classes.menuItem }}>Add class</MenuItem>
          )}
        </Select>

        {currentUserStore.isTeacher && (
          <AddClassDialog
            open={this.state.addClassDialogOpen}
            onClose={this.closeAddClassDialog}
            onAddClass={this.addClass}
          />
        )}

        <SelectClassDialog
          open={this.state.selectClassDialogOpen}
          onClose={this.closeSelectClassDialog}
          onSelect={this.selectClass}
        />

      </React.Fragment>
    );
  }
}

ClassMenu.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentModuleStore: PropTypes.object.isRequired,
  currentUserStore: PropTypes.object.isRequired,
  timelineStore: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClassMenu);
