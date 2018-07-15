/* eslint react/prop-types: error */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from '../Button/Button';
import ClassBarRowComp from '../ClassBarRowComp/ClassBarRowComp';
import ClassTaskRowComp from '../ClassTaskRowComp/ClassTaskRowComp';
import WeekComp from '../WeekComp/WeekComp';
import classes from './timeline.css';
import { observer, inject } from 'mobx-react';

@inject('timeLineStore', 'global')
@observer
export default class Timeline extends Component {
  hasRendered = false;

  state = {
    todayMarkerRef: null,
  };

  setTodayMarkerRef = React.createRef();
  timelineWrapperRef = React.createRef();
  classesContainerRef = React.createRef();
  buttonsContainerRef = React.createRef();

  componentDidMount() {
    this.props.timeLineStore.fetchItems()
      .then(this.handleClickTodayMarker);
  }

  handleClickTodayMarker = () => {
    const { todayMarkerRef } = this.state;
    let leftPos = todayMarkerRef.current.parentNode.getBoundingClientRect().x;
    leftPos -= this.timelineWrapperRef.current.offsetWidth / 2 - this.classesContainerRef.current.offsetWidth;
    this.timelineWrapperRef.current.scrollLeft += leftPos;
  };

  setTodayMarkerRef = ref => this.setState({ todayMarkerRef: ref });

  renderWeekComp() {
    if (!this.props.timeLineStore.allWeeks) return null;
    const { rowHeight, itemWidth } = this.props;
    return (
      <div className={classes.rowContainer}>
        {this.props.timeLineStore.allWeeks.map(week => (
          <WeekComp
            setTodayMarkerRef={this.setTodayMarkerRef}
            scrollingParentRef={this.timelineWrapperRef}
            key={week}
            week={week}
            rowHeight={rowHeight}
            itemWidth={itemWidth}
          />
        ))}
      </div>
    );
  }

  renderTaskRowComp() {
    const { groups } = this.props.timeLineStore;
    return groups.map(groupName => {
      const { itemWidth, rowHeight } = this.props;
      return (
        <div key={groupName} className={classes.rowContainer}>
          <ClassTaskRowComp
            groupName={groupName}
            width={itemWidth}
            height={rowHeight}
          />
        </div>
      );
    });
  }

  render() {
    const { allWeeks } = this.props.timeLineStore;
    const { itemWidth, rowHeight } = this.props;
    // if there items are fetched  width is the 200 times total weeks otherwise it's 100vh
    // FIXME: no idea why this is not working with just 16 instead of 21
    const width = allWeeks
      ? itemWidth * allWeeks.length + 21 * allWeeks.length + 'px'
      : '100vw';

    this.hasRendered = true;

    return (
      <div className="rootContainer">
        <ClassBarRowComp
          rowHeight={rowHeight}
          myRef={this.classesContainerRef}
        />
        <div
          className={classes.root}
          ref={this.timelineWrapperRef}
          onScroll={this.handleScroll}
        >
          <div className={classes.timelineContainer} style={{ width }}>
            <div className={classes.rowsContainer}>
              {this.renderWeekComp()}
              {this.renderTaskRowComp()}
            </div>
          </div>
        </div>
        <div ref={this.buttonsContainerRef} className={classes.buttonsContainer}>
          <Button clickHandler={this.handleClickTodayMarker} />
        </div>
      </div>
    );
  }
}

Timeline.wrappedComponent.propTypes = {
  itemWidth: PropTypes.number,
  rowHeight: PropTypes.number,
  timeLineStore: PropTypes.object,
};
