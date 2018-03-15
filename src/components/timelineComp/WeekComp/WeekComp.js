import React, { Component } from 'react';

import classes from './weekComp.css';
import TodayMarker from './TodayMarker/TodayMarker';
import { getCurrentWeek } from '../../../util';

export default class WeekComp extends Component {
  setTodayMarker = () => {
    const offset = getCurrentWeek(this.props.week, this.props.itemWidth);
    if (!offset) return null;
    return (
      <TodayMarker
        setTodayMarkerRef={this.props.setTodayMarkerRef}
        scrollingParentRef={this.props.scrollingParentRef}
        offset={offset}
      />
    );
  };
  render() {
    let [sunday1, sunday2] = this.props.week;
    let nextSaturday = sunday2.clone().subtract(1, 'days'); // get the saturday before class of the week after this one

    let month;
    if (sunday1.format('MMM') === nextSaturday.format('MMM')) {
      month = sunday1.format('MMM');
    } else {
      month = `${sunday1.format('MMM')}/${nextSaturday.format('MMM')}`;
    }
    sunday1 = sunday1.format('DD');
    nextSaturday = nextSaturday.format('DD');
    const { itemWidth, rowHeight } = this.props;
    const halfHeight = rowHeight / 2 + 'px';

    const todayMarkerComp = this.setTodayMarker(itemWidth);
    return (
      <div
        className={classes.weekCompContainer}
        style={{ width: itemWidth + 'px' }}
      >
        {todayMarkerComp}
        <span
          className={classes.monthContainer}
          style={{ height: halfHeight, lineHeight: halfHeight }}
        >
          {month}
        </span>
        <span style={{ height: halfHeight }} className={classes.daysContainer}>
          <div>
            <span className={classes.dayName}>Sun </span>
            <span>{sunday1}</span>
          </div>
          <div>
            <span className={classes.dayName}>Sat </span>
            <span>{nextSaturday}</span>
          </div>
        </span>
      </div>
    );
  }
}
