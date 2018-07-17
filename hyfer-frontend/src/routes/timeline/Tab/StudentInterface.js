import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
import UserList from './UserList';
import ModuleNotes from './ModuleNotes';
// import FaGitHub from 'react-icons/lib/fa/github';

const HYF_GITHUB_URL = 'https://github.com/HackYourFuture';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`,
  },
});

@inject('currentModuleStore', 'currentUser', 'ui')
@observer
class StudentInterface extends React.Component {

  handleChange = (event, value) => {
    this.props.ui.setTimelineTabIndex(value);
  };

  visitGitHubRepo = () =>
    window.open(`${HYF_GITHUB_URL}/${this.props.currentModuleStore.module.module_name}`, '_blank');

  render() {
    const { classes, currentModuleStore } = this.props;
    const { students, teachers } = currentModuleStore;

    const { timelineTabIndex } = this.props.ui;

    return (
      <React.Fragment>
        <Paper className={classes.root}>
          <Tabs value={timelineTabIndex} onChange={this.handleChange}>
            <Tab label="Notes" />
            <Tab label={
              <Badge className={classes.padding} color="primary" badgeContent={teachers.length}>
                Teachers
                </Badge>
            } />
            <Tab label={
              <Badge className={classes.padding} color="primary" badgeContent={students.length}>
                Students
                </Badge>
            } />
          </Tabs>
        </Paper>
        {timelineTabIndex === 0 && <TabContainer><ModuleNotes /></TabContainer>}
        {timelineTabIndex === 1 && <TabContainer><UserList role="teacher" /></TabContainer>}
        {timelineTabIndex === 2 && <TabContainer><UserList role="student" /></TabContainer>}
      </React.Fragment>
    );
  }
}

StudentInterface.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentModuleStore: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
};

export default withStyles(styles)(StudentInterface);
