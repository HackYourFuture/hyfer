import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Timeline from './Timeline';

const styles = (theme) => ({
  root: {
    marginBottom: theme.spacing.unit,
  },
});

class TimelinePage extends Component {
  render() {
    const { classes } = this.props;

    return (
      <main>
        <div className={classes.root}>
          <Timeline
            itemWidth={150}
            rowHeight={48}
          />
        </div>
      </main>
    );
  }
}

TimelinePage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TimelinePage);
