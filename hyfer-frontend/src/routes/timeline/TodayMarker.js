import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classes from './todayMarker.css';

export default class TodayMarker extends Component {
  todayMarker = React.createRef();

  componentDidMount = () => {
    this.props.setTodayMarkerRef(this.todayMarker);
    const scrollElem = this.props.scrollingParentRef;
    if (scrollElem.current) {
      let leftPos = this.todayMarker.current.parentNode.getBoundingClientRect().x;
      leftPos -= window.innerWidth / 2;
      scrollElem.current.scrollLeft = leftPos;
    }
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

TodayMarker.propTypes = {
  offset: PropTypes.number.isRequired,
  scrollingParentRef: PropTypes.object.isRequired,
  setTodayMarkerRef: PropTypes.func.isRequired,
};
