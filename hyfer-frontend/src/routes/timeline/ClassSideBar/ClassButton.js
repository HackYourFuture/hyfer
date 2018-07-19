/* eslint react/prop-types: error */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const token = localStorage.getItem('token');

const styles = (theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit}px`,
  },
  container: {
    width: 65,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    marginBottom: 0,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    boxShadow: 'inset 0 -1px 0 0 #eff2f3',
  },
  groupId: {
    backgroundColor: 'rgb(13, 107, 196)',
    color: 'white',
    borderRadius: '50%',
    padding: 8,
  },
});

@inject('timeline', 'ui')
@observer
class ClassButton extends Component {
  state = {
    popUp: false,
  };

  confirmArchiving = () => {
    const { classId } = this.props;
    this.handleClassArchive(classId);
    this.setState({
      popUp: false,
    });
  };

  cancelArchiving = () => {
    this.setState({
      popUp: false,
    });
  };

  rowButton = () => {
    const { classId, height, classes } = this.props;

    return (
      <div style={{ height: height + 'px' }} className={classes.container}>
        <button
          onClick={() => this.archivingPopUp()}
          className={this.props.classId && classes.groupId}
        >
          {classId}
        </button>
      </div>
    );
  };

  handleClassArchive = async id => {
    const group = this.props.timeline.groupsWithIds.filter(
      group => group.group_name.replace(/ /g, '').substr(5) === id,
    );

    try {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/groups/${group[0].id}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          archived: 1,
        }),
      });
      window.location.reload();
    } catch (err) {
      this.props.ui.setLastError(err);
    }
  };

  archivingPopUp = () => {
    this.setState({
      popUp: true,
    });
  };

  render() {
    const { classId, height, classes, disabled } = this.props;

    return (
      <Button
        variant="outlined"
        className={classes.root}
        style={{ height }}
        disabled={disabled}
      >
        Class {classId}
      </Button>
    );
  }
}

ClassButton.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  classId: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  height: PropTypes.number.isRequired,
  timeline: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClassButton);
