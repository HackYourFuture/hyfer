import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import TodayMarker from './TodayMarker';
import Typography from '@material-ui/core/Typography';

export function computeOffset(week, width) {
  const today = moment();

  if (today.isSameOrAfter(week[0]) && today.isBefore(week[1])) {
    const dayDiff = today.diff(week[0], 'days');
    const oneDayWidth = width / 7;
    return oneDayWidth * dayDiff;
  }

  return -1;
}

const styles = (theme) => ({
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

  renderTodayMarker = () => {
    const { week, setTodayMarkerRef, scrollParentRef } = this.props;
    const { itemWidth } = this.props.timelineStore;

    const offset = computeOffset(week, itemWidth);
    if (offset === -1) {
      return null;
    }

    return (
      <TodayMarker
        setTodayMarkerRef={setTodayMarkerRef}
        scrollParentRef={scrollParentRef}
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
          {this.renderTodayMarker()}
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
  scrollParentRef: PropTypes.object.isRequired,
  setTodayMarkerRef: PropTypes.func.isRequired,
  timelineStore: PropTypes.object.isRequired,
  week: PropTypes.array.isRequired,
};

export default withStyles(styles)(WeekIndicator);
