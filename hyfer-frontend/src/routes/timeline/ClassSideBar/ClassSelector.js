import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import { inject, observer } from 'mobx-react';
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
class ClassSelector extends Component {
  state = {
    isOpen: false,
  };

  openMenu = () => {
    this.setState({ isOpen: true });
  };

  closeMenu = () => {
    this.setState({ isOpen: false });
  };

  handleChange = async (event) => {
    const { value } = event.target;
    if (value === 'add') {
      this.setState({ isOpen: true });
    } else {
      this.props.timelineStore.setFilter(value);
      await this.props.timelineStore.fetchTimeline();
      if (value !== 'active') {
        await this.props.currentModuleStore.getGroupsByGroupName(value);
      } else {
        await this.props.currentModuleStore.clearSelectedModule();
      }
      this.props.timelineStore.notify(CLASS_SELECTION_CHANGED, value);
    }
  };

  renderMenuItems({ isActive }) {
    const { classes } = this.props;
    const { groups } = this.props.timelineStore;
    return groups
      .filter(group => group.archived === (isActive ? 0 : 1))
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
    // const { groups } = this.props.timelineStore;
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

          {this.renderMenuItems({ isActive: true })}
          <Divider />
          {this.renderMenuItems({ isActive: false })}
          {/*           
          {groups.map(group => {
            const number = group.group_name.match(/(\d+)$/)[1];
            const root = group.archived ? classes.archived : classes.active;
            return <MenuItem
              key={number}
              value={group.group_name}
              classes={{ root }}
            >
              Class {number}
            </MenuItem>;
          })} */}

          {currentUserStore.isTeacher && <Divider />}
          {currentUserStore.isTeacher && <MenuItem value="add" classes={{ root: classes.menuItem }}>Add class</MenuItem>}

        </Select>
        {currentUserStore.isTeacher && <AddClassDialog
          open={this.state.isOpen}
          onClose={this.closeMenu}
        />}
      </React.Fragment>
    );
  }
}

ClassSelector.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentModuleStore: PropTypes.object.isRequired,
  currentUserStore: PropTypes.object.isRequired,
  timelineStore: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClassSelector);
