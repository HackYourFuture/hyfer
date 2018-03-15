import React, { Component } from 'react';

import classes from './todayMarker.css';

export default class TodayMarker extends Component {
  componentDidMount = () => {
    const { todayMarker } = this.refs;
    this.props.setTodayMarkerRef(todayMarker);
    let leftPos = todayMarker.parentNode.getBoundingClientRect().x;
    leftPos -= window.innerWidth / 2;
    const scrollEl = this.props.scrollingParentRef;
    scrollEl.scrollLeft = leftPos;
  };

  render() {
    const { offset } = this.props;
    return (
      <div
        ref="todayMarker"
        style={{ left: offset + 'px' }}
        className={classes.todayMarker + ' todayMarker'}
      />
    );
  }
}
