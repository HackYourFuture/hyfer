import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import { inject, observer } from 'mobx-react';
import AddClassDialog from './AddClassDialog';

const styles = (theme) => ({
  select: {
    margin: theme.spacing.unit,
  },
  active: {
    justifyContent: 'center',
  },
  archived: {
    justifyContent: 'center',
    color: theme.palette.text.secondary,
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
      this.props.timelineStore.fetchTimeline();
      if (value !== 'active') {
        this.props.currentModuleStore.getGroupsByGroupName(value);
      } else {
        this.props.currentModuleStore.clearCurrentModule();
      }
    }
  };

  render() {
    const { classes, currentUserStore } = this.props;
    const { groups } = this.props.timelineStore;
    return (
      <React.Fragment>
        <Select
          value={this.props.timelineStore.filter}
          onChange={this.handleChange}
          className={classes.select}
        >
          <MenuItem value='active' classes={{ root: classes.menuItem }}>All active</MenuItem>
          <Divider />

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
          })}

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
