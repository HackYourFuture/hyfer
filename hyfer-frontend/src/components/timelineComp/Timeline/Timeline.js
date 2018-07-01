/* eslint react/prop-types: error */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import loader from '../../../assets/images/Eclipse.gif';
import { errorMessage } from '../../../notify';
import { TODAY_MARKER_REFERENCE } from '../../../store';
import Button from '../Button/Button';
import ClassBarRowComp from '../ClassBarRowComp/ClassBarRowComp';
import ClassTaskRowComp from '../ClassTaskRowComp/ClassTaskRowComp';
import WeekComp from '../WeekComp/WeekComp';
import classes from './timeline.css';
import { observer, inject } from 'mobx-react';

@inject('timeLineStore')
@observer
export default class Timeline extends Component {
  state = {
    todayMarkerRef: null,
  };

  setTodayMarkerRef = React.createRef();
  timelineWrapper = React.createRef();
  classesContainer = React.createRef();
  buttonsContainer = React.createRef();

  setTodayMarkerRef = ref => {
    this.setState({ todayMarkerRef: ref });
  };

  renderWeekComp = () => {
    if (!this.props.timeLineStore.allWeeks) return null;
    const { rowHeight, itemWidth } = this.props;
    return (
      <div className={classes.rowContainer}>
        {this.props.timeLineStore.allWeeks.map(week => (
          <WeekComp
            setTodayMarkerRef={this.setTodayMarkerRef}
            scrollingParentRef={this.timelineWrapper}
            key={week}
            week={week}
            rowHeight={rowHeight}
            itemWidth={itemWidth}
          />
        ))}
      </div>
    );
  };

  renderTaskRowComp = () => {
    if (
      !this.props.timeLineStore.groups ||
      !this.props.timeLineStore.items ||
      !this.props.timeLineStore.allWeeks
    ) {
      // implement the loader giv
      return (
        <div className={classes.divLoading}>
          <img src={loader} alt="loader" className={classes.load} />
        </div>
      );
    }
    return this.props.timeLineStore.groups.map(group => {
      const items = this.props.timeLineStore.items[group];
      const { itemWidth, rowHeight } = this.props;
      return (
        <div key={items[0].group_name} className={classes.rowContainer}>
          <ClassTaskRowComp
            isTeacher={this.props.isTeacher}
            selectedModule={this.props.selectedModule}
            items={items}
            width={itemWidth}
            height={rowHeight}
            itemClickHandler={this.props.itemClickHandler}
            infoSelectedModule={this.props.infoSelectedModule}
          />
        </div>
      );
    });
  };

  observer = mergedData => {
    switch (mergedData.type) {
      case TODAY_MARKER_REFERENCE:
        this.setState({ todayMarkerRef: mergedData.payload.todayMarkerRef });
        break;
      default:
        break;
    }
  };

  handleClickTodayMarker = () => {
    const todayMarker = this.state.todayMarkerRef;
    const classesContainer = this.classesContainer; // hackish way, hope good
    const scrollEl = this.timelineWrapper;
    let leftPos = todayMarker.current.parentNode.getBoundingClientRect().x;
    leftPos -= scrollEl.current.offsetWidth / 2 - classesContainer.current.offsetWidth;
    scrollEl.current.scrollLeft += leftPos;
  };

  componentDidMount = () => {
    if (!this.props.teachers) {
      this.props.timeLineStore.fetchItems(false)
        .then(() => {
          this.setState({ loaded: true });
        })
        .catch(errorMessage);
    } else {
      this.props.timeLineStore.fetchItems(true)
        .then(() => {
          this.setState({ loaded: true });
        })
        .catch(errorMessage);
    }
  };

  render() {
    const { allWeeks } = this.props.timeLineStore;
    const { itemWidth, rowHeight } = this.props;
    // if there items are fetched  width is the 200 times total weeks otherwise it's 100vh
    // FIXME: no idea why this is not working with just 16 instead of 21
    const width = allWeeks
      ? itemWidth * allWeeks.length + 21 * allWeeks.length + 'px'
      : '100vw';
    return (
      <div className="rootContainer">
        <ClassBarRowComp
          groups={this.props.timeLineStore.groups}
          rowHeight={rowHeight}
          myRef={this.classesContainer}
        />
        <div
          className={classes.root}
          ref={this.timelineWrapper}
          onScroll={this.handleScroll}
        >
          <div className={classes.timelineContainer} style={{ width: width }}>
            <div className={classes.rowsContainer}>
              {this.renderWeekComp()}
              {this.renderTaskRowComp()}
            </div>
          </div>
        </div>
        <div ref={this.buttonsContainer} className={classes.buttonsContainer}>
          <Button
            clickHandler={this.handleClickTodayMarker}
          />
        </div>
      </div>
    );
  }
}

Timeline.wrappedComponent.propTypes = {
  allModules: PropTypes.array,
  infoSelectedModule: PropTypes.object,
  isTeacher: PropTypes.bool,
  itemClickHandler: PropTypes.func,
  itemWidth: PropTypes.number,
  rowHeight: PropTypes.number,
  selectedModule: PropTypes.object,
  teachers: PropTypes.array,
  timelineItems: PropTypes.object,
  timeLineStore: PropTypes.object,
};
