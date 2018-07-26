import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import ClassSideBar from './ClassSideBar/ClassSideBar';
import TimelineRow from './TimelineRow';
import WeekIndicator from './WeekIndicator';
import ModuleReadMe from './ModuleReadMe';
import StudentInterface from './Tab/StudentInterface';
import { CLASS_SELECTION_CHANGED } from '../../stores';

const styles = (theme) => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.unit,
  },
  scrollParent: {
    marginTop: theme.spacing.unit * 2,
    maxWidth: '100vw;',
    overflowX: 'scroll',
    overflowY: 'hidden',
    position: 'relative',
    display: 'flex',
    marginBottom: theme.spacing.unit,
  },
  rowContainer: {
    display: 'flex',
    marginBottom: 0,
  },
});

@inject('timeline', 'currentUser', 'currentModule')
@observer
class TimelinePage extends Component {

  state = {
    todayMarkerRef: null,
    initialized: false,
  };

  setTodayMarkerRef = React.createRef();
  scrollParentRef = React.createRef();
  classSideBarRef = React.createRef();

  async componentDidMount() {
    const { group_name } = this.props.currentUser.user;
    if (group_name != null) {
      this.props.timeline.setFilter(group_name);
      await this.props.timeline.fetchTimeline(group_name);
      await this.props.currentModule.getGroupsByGroupName(group_name);
      this.setState({ initialized: true });
    } else {
      await this.props.timeline.fetchTimeline();
      this.setState({ initialized: true });
    }

    this.props.timeline.onNotify(CLASS_SELECTION_CHANGED, () => {
      this.onTodayClick();
    });

    this.onTodayClick();
  }

  onTodayClick = () => {
    const { todayMarkerRef } = this.state;
    let leftPos = 0;
    if (todayMarkerRef && todayMarkerRef.current) {
      leftPos = todayMarkerRef.current.parentNode.getBoundingClientRect().x;
      leftPos -= 2 * this.classSideBarRef.current.offsetWidth;
    } else {
      // Go to the end of the timeline (assuming an archived class)
      leftPos = this.scrollParentRef.current.children[0].clientWidth;
    }
    this.scrollParentRef.current.scrollLeft += leftPos;
  };

  setTodayMarkerRef = ref => this.setState({ todayMarkerRef: ref });

  renderWeekIndicators() {
    const { classes } = this.props;
    return (
      <div className={classes.rowContainer}>
        {this.props.timeline.allWeeks.map(week => (
          <WeekIndicator
            setTodayMarkerRef={this.setTodayMarkerRef}
            scrollParentRef={this.scrollParentRef}
            key={week}
            week={week}
          />
        ))}
      </div>
    );
  }

  renderRows() {
    const { classes } = this.props;
    const { groupItems } = this.props.timeline;
    return Object.keys(groupItems).map((groupName) => {
      return (
        <div key={groupName} className={classes.rowContainer}>
          <TimelineRow groupName={groupName} />
        </div>
      );
    });
  }

  render() {

    const { classes } = this.props;
    const { isStudent, isTeacher } = this.props.currentUser;
    const { selectedModule } = this.props.currentModule;

    if (!this.state.initialized) {
      return null;
    }

    return (
      <React.Fragment>
        <div className={classes.root}>
          <ClassSideBar
            myRef={this.classSideBarRef}
            onClick={this.onTodayClick}
          />
          <div
            className={classes.scrollParent}
            ref={this.scrollParentRef}
          >
            <div>
              {this.renderWeekIndicators()}
              {this.renderRows()}
            </div>
          </div>
        </div>
        {(isTeacher || isStudent) && selectedModule
          ? <StudentInterface />
          : <ModuleReadMe />}
      </React.Fragment>
    );
  }
}

TimelinePage.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentModule: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  timeline: PropTypes.object.isRequired,
};

export default withStyles(styles)(TimelinePage);
