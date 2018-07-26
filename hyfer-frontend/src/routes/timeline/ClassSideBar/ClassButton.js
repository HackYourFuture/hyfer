/* eslint react/prop-types: error */
import React from 'react';
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

@inject('timeline', 'uiStore')
@observer
class ClassButton extends React.Component {

  handleClick = (e) => {
    this.props.onClick(e, this.props.group);
  }

  render() {
    const { group, classes, disabled } = this.props;
    const classNumber = group.group_name.match(/\d+/)[0];

    return (
      <Button
        variant="outlined"
        className={classes.root}
        style={{ height: this.props.timeline.rowHeight }}
        disableRipple
        disabled={disabled}
        onClick={this.handleClick}
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
  onClick: PropTypes.func.isRequired,
  timeline: PropTypes.object.isRequired,
  uiStore: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClassButton);
