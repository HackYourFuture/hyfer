import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import SelectClassDialog from './SelectClassDialog';
import ClassStartDateDialog from './ClassStartDateDialog';
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

@inject('timeline', 'currentUser', 'currentModule')
@observer
class ClassSelectMenu extends Component {

  nextClassNumber = 0;

  state = {
    classStartDateDialogOpen: false,
    selectClassDialogOpen: false,
  };

  openClassStartDateDialog = () => {
    const { groups } = this.props.timeline;
    const classNumbers = groups.map(group => +(group.group_name.match(/\d+/)[0]));
    this.nextClassNumber = Math.max(...classNumbers) + 1;
    this.setState({ classStartDateDialogOpen: true });
  };

  closeClassStartDateDialog = () => {
    this.setState({ classStartDateDialogOpen: false });
  };

  closeSelectClassDialog = () => {
    this.setState({ selectClassDialogOpen: false });
  };

  selectClass = async (groupName) => {
    this.closeSelectClassDialog();
    this.props.timeline.setFilter(groupName);
    await this.props.timeline.fetchTimeline();
    if (groupName !== 'active') {
      await this.props.currentModule.getGroupsByGroupName(groupName);
    } else {
      await this.props.currentModule.clearSelectedModule();
    }
    this.props.timeline.notify(CLASS_SELECTION_CHANGED);
  }

  addClass = async ({ classNumber, startingDate }) => {
    await this.props.timeline.addNewClass(`class${classNumber}`, startingDate.toISOString());
    this.props.timeline.fetchTimeline();
  };

  handleChange = (event) => {
    const { value } = event.target;
    if (value === 'add') {
      this.openClassStartDateDialog();
    }
    else if (value === 'archived') {
      this.setState({ selectClassDialogOpen: true });
    } else {
      this.selectClass(value);
    }
  };

  renderMenuItems() {
    const { classes } = this.props;
    const { groups } = this.props.timeline;
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
    const { classes, currentUser } = this.props;
    return (
      <React.Fragment>
        <Select
          value={this.props.timeline.filter}
          onChange={this.handleChange}
          classes={{ root: classes.select }}
          disabled={!currentUser.isStudentOrTeacher}
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
          {currentUser.isTeacher && <Divider />}
          {currentUser.isTeacher && (
            <MenuItem value="add" classes={{ root: classes.menuItem }}>Add class</MenuItem>
          )}
        </Select>

        {currentUser.isTeacher && (
          <ClassStartDateDialog
            open={this.state.classStartDateDialogOpen}
            classNumber={this.nextClassNumber}
            title="Add new class"
            prompt="Please select a starting Sunday for the new class."
            onClose={this.closeClassStartDateDialog}
            onSave={this.addClass}
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

ClassSelectMenu.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentModule: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  timeline: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClassSelectMenu);
