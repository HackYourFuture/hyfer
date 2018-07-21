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

@inject('timelineStore', 'currentUserStore', 'currentModuleStore')
@observer
class TimelinePage extends Component {

  componentDidMount() {
    this.props.timelineStore.fetchItems(true);
  }

  render() {
    const { timelineStore, classes, currentUserStore } = this.props;
    const { currentModule } = this.props.currentModuleStore;

    if (timelineStore.items == null) {
      return null;
    }

    return (
      <main>
        <div className={classes.root}>
          <Timeline
            itemWidth={150}
            rowHeight={48}
          />
        </div>
        {(currentUserStore.isTeacher || currentUserStore.isStudent) && currentModule
          ? <StudentInterface />
          : <ModuleReadMe />}
      </main>
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
