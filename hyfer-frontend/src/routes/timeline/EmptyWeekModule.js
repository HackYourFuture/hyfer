import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const styles = (theme) => ({
  root: {
    margin: theme.spacing.unit / 2,
  },
});

class EmptyWeekModule extends Component {

  render() {
    const { width, height, classes } = this.props;
    return (
      <Paper
        elevation={0}
        className={classes.root}
        style={{ width, height }}
      />
    );
  }
}

EmptyWeekModule.propTypes = {
  classes: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export default withStyles(styles)(EmptyWeekModule);
