import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import ClassSideBar from './ClassSideBar/ClassSideBar';
import TimelineRow from './TimelineRow';
import WeekIndicator from './WeekIndicator';
import ModuleReadMe from './ModuleReadme';
import StudentInterface from './Tab/StudentInterface';

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing.unit * 2,
    maxWidth: '100vw;',
    overflowX: 'scroll',
    overflowY: 'hidden',
    position: 'relative',
    backgroundColor: grey[50],
  },
  root2: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineContainer: {
    position: 'relative',
    // backgroundColor: '#f6f6f8',
    display: 'flex',
    marginBottom: theme.spacing.unit,
  },
  rowsContainer: {
    position: 'relative',
    left: 81,
    display: 'flex',
    flexDirection: 'column',
  },
  rowContainer: {
    display: 'flex',
    marginBottom: 0,
  },
});

@inject('timelineStore', 'currentUserStore', 'currentModuleStore')
@observer
class Timeline extends Component {
  hasRendered = false;

  state = {
    todayMarkerRef: null,
    initialized: false,
  };

  setTodayMarkerRef = React.createRef();
  timelineWrapperRef = React.createRef();
  classesContainerRef = React.createRef();

  async componentDidMount() {
    const { group_name } = this.props.currentUserStore.user;
    if (group_name != null) {
      await this.props.currentModuleStore.getGroupsByGroupName(group_name);
      this.props.timelineStore.setFilter(group_name);
      await this.props.timelineStore.fetchTimeline(group_name);
    } else {
      await this.props.timelineStore.fetchTimeline();
    }

    this.onTodayClick();
  }

  onTodayClick = () => {
    const { todayMarkerRef } = this.state;
    let leftPos = 0;
    if (todayMarkerRef && todayMarkerRef.current) {
      leftPos = todayMarkerRef.current.parentNode.getBoundingClientRect().x;
    }
    leftPos -= this.timelineWrapperRef.current.offsetWidth / 2 - this.classesContainerRef.current.offsetWidth;
    this.timelineWrapperRef.current.scrollLeft += leftPos;
  };

  setTodayMarkerRef = ref => this.setState({ todayMarkerRef: ref });

  renderWeekIndicators() {
    const { rowHeight, itemWidth, classes } = this.props;
    return (
      <div className={classes.rowContainer}>
        {this.props.timelineStore.allWeeks.map(week => (
          <WeekIndicator
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

  renderTimelineRows() {
    const { items } = this.props.timelineStore;
    return Object.keys(items).map((groupName) => {
      const { itemWidth, rowHeight, classes } = this.props;
      return (
        <div key={groupName} className={classes.rowContainer}>
          <TimelineRow
            groupName={groupName}
            width={itemWidth}
            height={rowHeight}
          />
        </div>
      );
    });
  }

  render() {
    const { allWeeks } = this.props.timelineStore;
    const { itemWidth, rowHeight, classes } = this.props;
    const { timelineStore, currentUserStore } = this.props;
    const { currentModule } = this.props.currentModuleStore;

    if (timelineStore.items == null) {
      return null;
    }

    // if there items are fetched  width is the 200 times total weeks otherwise it's 100vh
    // FIXME: no idea why this is not working with just 16 instead of 21
    const width = allWeeks
      ? itemWidth * allWeeks.length + 21 * allWeeks.length + 'px'
      : '100vw';

    this.hasRendered = true;

    return (
      <div>
        <div className={classes.root2}>
          <ClassSideBar
            rowHeight={rowHeight}
            myRef={this.classesContainerRef}
            onClick={this.onTodayClick}
          />
          <div
            className={classes.root}
            ref={this.timelineWrapperRef}
            onScroll={this.handleScroll}
          >
            <div className={classes.timelineContainer} style={{ width }}>
              <div >
                {this.renderWeekIndicators()}
                {this.renderTimelineRows()}
              </div>
            </div>
          </div>
        </div>
        {(currentUserStore.isTeacher || currentUserStore.isStudent) && currentModule
          ? <StudentInterface />
          : <ModuleReadMe />}
      </div>
    );
  }
}

Timeline.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentModuleStore: PropTypes.object.isRequired,
  currentUserStore: PropTypes.object.isRequired,
  itemWidth: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  timelineStore: PropTypes.object.isRequired,
};

export default withStyles(styles)(Timeline);
