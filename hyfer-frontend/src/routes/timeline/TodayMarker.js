import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

const styles = (theme) => ({
  root: {
    position: 'absolute',
    width: 0,
    borderWidth: 4,
    borderStyle: 'solid',
    borderColor: theme.palette.secondary.main,
    height: '100vh',
    top: 0,
    zIndex: 3,
    pointerEvents: 'none',
    opacity: 0.25,
  },
});

class TodayMarker extends React.Component {

  todayMarkerRef = React.createRef();

  componentDidMount = () => {
    this.props.setTodayMarkerRef(this.todayMarkerRef);
  };

  render() {
    const { classes, offset } = this.props;
    return (
      <div
        className={classes.root}
        style={{ left: offset }}
        ref={this.todayMarkerRef}
      />
    );
  }
}

TodayMarker.propTypes = {
  classes: PropTypes.object.isRequired,
  offset: PropTypes.number.isRequired,
  setTodayMarkerRef: PropTypes.func.isRequired,
};

export default withStyles(styles)(TodayMarker);
