import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import StartDateDialog from './StartDateDialog';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import { CLASS_SELECTION_CHANGED } from '../../../stores';

@inject('timeline')
@observer
class ClassOptionsMenu extends React.Component {

  get classNumber() {
    return +(this.props.group.group_name.match(/\d+/)[0]);
  }

  state = {
    startDateDialogOpen: false,
    selectClassDialogOpen: false,
    confirmationDialogOpen: false,
  }

  openStartDateDialog = () => {
    this.props.onCloseMenu();
    this.setState({ startDateDialogOpen: true });
  }

  closeStartDateDialog = () => {
    this.setState({ startDateDialogOpen: false });
  }

  openConfirmationDialog = () => {
    this.props.onCloseMenu();
    this.setState({ confirmationDialogOpen: true });
  }

  closeConfirmationDialog = () => {
    this.setState({ confirmationDialogOpen: false });
  }

  changeStartDate = async ({ startDate }) => {
    await this.props.timeline.updateClass(this.props.group.id, {
      starting_date: startDate.format('YYYY-MM-DD'),
    });
    await this.props.timeline.fetchTimeline();
  }

  archiveClass = async () => {
    this.props.onCloseMenu();
    this.closeConfirmationDialog();
    await this.props.timeline.updateClass(this.props.group.id, { archived: 1 });
    await this.props.timeline.fetchTimeline();
    this.props.timeline.notify(CLASS_SELECTION_CHANGED);
  }

  unarchiveClass = async () => {
    this.props.onCloseMenu();
    await this.props.timeline.updateClass(this.props.group.id, { archived: 0 });
    await this.props.timeline.fetchTimeline();
    this.props.timeline.notify(CLASS_SELECTION_CHANGED);
  }

  render() {
    const { group } = this.props;
    return (
      <React.Fragment>
        <Menu
          id="simple-menu"
          anchorEl={this.props.anchorEl}
          open={Boolean(this.props.anchorEl)}
          onClose={this.props.onCloseMenu}
        >
          {group.archived === 0 && (
            <MenuItem onClick={this.openStartDateDialog}>Change class starting date</MenuItem>
          )}
          {group.archived === 1 && (
            <MenuItem onClick={this.unarchiveClass}>Unarchive class {this.classNumber}</MenuItem>
          )}
          {group.archived === 0 && (
            <MenuItem onClick={this.openConfirmationDialog}>Archive class {this.classNumber}</MenuItem>
          )}
        </Menu>
        <StartDateDialog
          open={this.state.startDateDialogOpen}
          classNumber={this.classNumber}
          startDate={moment(group.starting_date).utc()}
          title="Change starting date for class"
          prompt="Please select a new starting Sunday for the class."
          onClose={this.closeStartDateDialog}
          onSave={this.changeStartDate}
        />
        <ConfirmationDialog
          open={this.state.confirmationDialogOpen}
          onOk={this.archiveClass}
          onCancel={this.closeConfirmationDialog}
          title={`Archive Class ${this.classNumber}`}
          message="Are you sure you wish to archive this class?"
        />
      </React.Fragment>
    );
  }
}

ClassOptionsMenu.wrappedComponent.propTypes = {
  anchorEl: PropTypes.object,
  group: PropTypes.object.isRequired,
  onCloseMenu: PropTypes.func.isRequired,
  timeline: PropTypes.object.isRequired,
};

export default ClassOptionsMenu;
