/* eslint react/prop-types: error */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';

import TodayMarker from './TodayMarker';

export function getCurrentWeek(week, width) {
  const today = new moment();
  if (!today.isAfter(week[0]) || !today.isBefore(week[1])) return null;
  const dayDiff = today.diff(week[0], 'days');
  const oneDayWidth = width / 7;
  const offset = oneDayWidth * dayDiff;
  return offset;
}
const styles = (theme) => ({
  root: {
    position: 'relative',
    margin: theme.spacing.unit / 2,
    padding: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
  },
  monthContainer: {
    marginBottom: theme.spacing.unit,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  daysContainer: {
    marginTop: theme.spacing.unit,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

class WeekIndicator extends Component {
  setTodayMarker = () => {
    const offset = getCurrentWeek(this.props.week, this.props.itemWidth);
    if (!offset && offset !== 0) return null;
    return (
      <TodayMarker
        setTodayMarkerRef={this.props.setTodayMarkerRef}
        scrollingParentRef={this.props.scrollingParentRef}
        offset={offset}
      />
    );
  };

  render() {
    // eslint-disable-next-line prefer-const
    let [startSunday, endSunday] = this.props.week;

    // get the saturday before class of the week after this one
    let endSaturday = endSunday.clone().subtract(1, 'days');

    let month;
    if (startSunday.format('MMM') === endSaturday.format('MMM')) {
      month = startSunday.format('MMMM');
    } else {
      month = `${startSunday.format('MMMM')}/${endSaturday.format('MMMM')}`;
    }

    startSunday = startSunday.format('DD');
    endSaturday = endSaturday.format('DD');

    const { itemWidth } = this.props;

    const todayMarkerComp = this.setTodayMarker();

    const { classes } = this.props;

    return (
      <Paper
        style={{ width: itemWidth }}
        elevation={0}
        className={classes.root}
      >
        {todayMarkerComp}
        <Typography variant="body1"
          className={classes.monthContainer}
        >
          {month}
        </Typography>
        <Divider />
        <Typography variant="subheading" className={classes.daysContainer}>
          <div>Sun {startSunday}</div>
          <div>–</div>
          <div>Sat {endSaturday}</div>
        </Typography>
      </Paper>
    );
  }
}

WeekIndicator.propTypes = {
  week: PropTypes.object.isRequired,
  itemWidth: PropTypes.number.isRequired,
  setTodayMarkerRef: PropTypes.func.isRequired,
  scrollingParentRef: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(WeekIndicator);
