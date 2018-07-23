import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';

import TodayMarker from './TodayMarker';

export function getCurrentWeek(week, width) {
  const today = new moment();
  if (!today.isAfter(week[0]) || !today.isBefore(week[1])) {
    return null;
  }
  const dayDiff = today.diff(week[0], 'days');
  const oneDayWidth = width / 7;
  const offset = oneDayWidth * dayDiff;
  return offset;
}

const styles = (theme) => ({
  root: {
    padding: theme.spacing.unit / 2,
  },
  container: {
    position: 'relative',
    margin: theme.spacing.unit / 2,
    display: 'flex',
    flexDirection: 'column',
  },
  monthContainer: {
    margin: theme.spacing.unit,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  daysContainer: {
    margin: theme.spacing.unit,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

@inject('timelineStore')
@observer
class WeekIndicator extends Component {

  setTodayMarker = () => {
    const { itemWidth } = this.props.timelineStore;
    const { week } = this.props;
    const offset = getCurrentWeek(week, itemWidth);
    if (!offset && offset !== 0) {
      return null;
    }

    return (
      <TodayMarker
        setTodayMarkerRef={this.props.setTodayMarkerRef}
        scrollingParentRef={this.props.scrollingParentRef}
        offset={offset}
      />
    );
  };

  render() {
    const [startSunday, endSunday] = this.props.week;
    const endSaturday = endSunday.clone().subtract(1, 'days');
    const month = startSunday.format('MMMM YYYY');

    const { classes } = this.props;
    const { itemWidth } = this.props.timelineStore;

    return (
      <div style={{ width: itemWidth }}>
        <Paper
          elevation={1}
          className={classes.container}
        >
          {this.setTodayMarker()}
          <Typography variant="caption"
            className={classes.monthContainer}
          >
            {month}
          </Typography>
          <Divider />
          <Typography variant="body2" color="textSecondary" className={classes.daysContainer}>
            <div>Sun {startSunday.format('DD')}</div>
            <div>–</div>
            <div>Sat {endSaturday.format('DD')}</div>
          </Typography>
        </Paper>
      </div>
    );
  }
}

WeekIndicator.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  scrollingParentRef: PropTypes.object.isRequired,
  setTodayMarkerRef: PropTypes.func.isRequired,
  timelineStore: PropTypes.object.isRequired,
  week: PropTypes.object.isRequired,
};

export default withStyles(styles)(WeekIndicator);
