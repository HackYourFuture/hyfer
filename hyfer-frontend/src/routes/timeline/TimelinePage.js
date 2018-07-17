import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core';
import ModuleReadMe from './ModuleReadme';
import Timeline from './Timeline';
import StudentInterface from './Tab/StudentInterface';

const styles = (theme) => ({
  root: {
    marginBottom: theme.spacing.unit,
  },
});

@inject('timeline', 'currentUser')
@observer
class TimelinePage extends Component {

  componentDidMount() {
    this.props.timeline.fetchItems(true);
  }

  render() {
    const { timeline, classes, currentUser } = this.props;

    if (timeline.items == null) {
      return null;
    }

    return (
      <main>
        <div className={classes.root}>
          <Timeline
            itemWidth={170}
            rowHeight={48}
          />
        </div>
        {currentUser.isTeacher || currentUser.isStudent
          ? <StudentInterface />
          : <ModuleReadMe />}
      </main>
    );
  }
}

TimelinePage.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  timeline: PropTypes.object.isRequired,
};

export default withStyles(styles)(TimelinePage);
