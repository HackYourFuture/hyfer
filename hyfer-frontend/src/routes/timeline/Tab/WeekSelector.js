import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import { inject, observer } from 'mobx-react';
import AddClassDialog from './AddClassDialog';

const styles = (theme) => ({
  root: {
    margin: theme.spacing.unit,
  },
});

@inject('timelineStore', 'currentUserStore')
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

  handleChange = event => {
    const { value } = event.target;
    if (value === 'add') {
      this.setState({ isOpen: true });
    } else {
      this.props.timelineStore.setFilter(value);
    }
  };

  render() {
    const { classes, currentUserStore } = this.props;
    const { timeline, filter } = this.props.timelineStore;
    return (
      <React.Fragment>
        <Select
          value={filter}
          onChange={this.handleChange}
          className={classes.root}
        >
          <MenuItem value='all'>All Classes</MenuItem>
          <Divider />
          {Object.keys(timeline).map(className => {
            const number = className.match(/(\d+)$/)[1];
            return <MenuItem key={number} value={className}>Class {number}</MenuItem>;
          })}
          {currentUserStore.isTeacher && <Divider />}
          {currentUserStore.isTeacher && <MenuItem value="add">Add Class</MenuItem>}
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
  currentUserStore: PropTypes.object.isRequired,
  timelineStore: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClassSelector);
