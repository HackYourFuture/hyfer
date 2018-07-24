/* eslint react/prop-types: error */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit}px`,
  },
});

@inject('timelineStore', 'uiStore')
@observer
class ClassButton extends Component {

  render() {
    const { group, classes, disabled } = this.props;
    const classNumber = group.group_name.match(/\d+/)[0];

    return (
      <Button
        variant="outlined"
        className={classes.root}
        style={{ height: this.props.timelineStore.rowHeight }}
        disabled={disabled}
      >
        {classNumber}
      </Button>
    );
  }
}

ClassButton.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  // height: PropTypes.number.isRequired,
  timelineStore: PropTypes.object.isRequired,
  uiStore: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClassButton);
