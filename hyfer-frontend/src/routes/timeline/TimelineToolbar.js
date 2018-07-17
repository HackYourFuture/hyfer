import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit,
  },
  container: {
    display: 'flex',
    zIndex: 3,
  },
  filler: {
    flex: 1,
  },
  'buttonsWrapper > *': {
    marginTop: 5,
    display: 'inline-block',
  },
});

@observer
class TimelineToolbar extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <span className={classes.filler} />
        <Button
          className={classes.button}
          onClick={this.props.onTodayClick}
          variant="contained"
          title="Go to today">
          Today
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(TimelineToolbar);

TimelineToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  onTodayClick: PropTypes.func.isRequired,
};
