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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.unit,
  },
  container: {
    marginTop: theme.spacing.unit * 2,
    maxWidth: '100vw;',
    overflowX: 'scroll',
    overflowY: 'hidden',
    position: 'relative',
    backgroundColor: grey[50],
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
class TimelinePage extends Component {
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
    const { classes } = this.props;
    return (
      <div className={classes.rowContainer}>
        {this.props.timelineStore.allWeeks.map(week => (
          <WeekIndicator
            setTodayMarkerRef={this.setTodayMarkerRef}
            scrollingParentRef={this.timelineWrapperRef}
            key={week}
            week={week}
          />
        ))}
      </div>
    );
  }

  renderTimelineRows() {
    const { classes } = this.props;
    const { items } = this.props.timelineStore;
    return Object.keys(items).map((groupName) => {
      return (
        <div key={groupName} className={classes.rowContainer}>
          <TimelineRow groupName={groupName} />
        </div>
      );
    });
  }

  render() {

    const { classes } = this.props;
    const { isStudent, isTeacher } = this.props.currentUserStore;
    const { currentModule } = this.props.currentModuleStore;

    if (this.props.timelineStore.items == null) {
      return null;
    }

    this.hasRendered = true;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <ClassSideBar
            myRef={this.classesContainerRef}
            onClick={this.onTodayClick}
          />
          <div
            className={classes.container}
            ref={this.timelineWrapperRef}
            onScroll={this.handleScroll}
          >
            <div className={classes.timelineContainer}>
              <div >
                {this.renderWeekIndicators()}
                {this.renderTimelineRows()}
              </div>
            </div>
          </div>
        </div>
        {(isTeacher || isStudent) && currentModule
          ? <StudentInterface />
          : <ModuleReadMe />}
      </React.Fragment>
    );
  }
}

TimelinePage.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentModuleStore: PropTypes.object.isRequired,
  currentUserStore: PropTypes.object.isRequired,
  timelineStore: PropTypes.object.isRequired,
};

export default withStyles(styles)(TimelinePage);
