import React, { Component } from 'react';

import classes from './todayMarker.css';

export default class TodayMarker extends Component {
  todayMarker = React.createRef();

  componentDidMount = () => {
    this.props.setTodayMarkerRef(this.todayMarker);
    let leftPos = this.todayMarker.current.parentNode.getBoundingClientRect().x;
    leftPos -= window.innerWidth / 2;
    const scrollEl = this.props.scrollingParentRef;
    scrollEl.current.scrollLeft = leftPos;
  };

  render() {
    const { offset } = this.props;
    return (
      <div
        ref={this.todayMarker}
        style={{ left: offset + 'px' }}
        className={classes.todayMarker + ' todayMarker'}
      />
    );
  }
}
