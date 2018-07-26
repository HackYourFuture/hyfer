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

const HYF_GITHUB_URL = 'https://github.com/HackYourFuture';

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
  tabContainer: {
    padding: theme.spacing.unit * 2,
  },
});

function TabContainer(props) {
  return (
    <Typography component="div">
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

@inject('currentModule', 'currentUser', 'timeline')
@observer
class StudentInterface extends React.Component {

  handleChange = (event, value) => {
    this.props.timeline.setTabIndex(value);
  };

  visitGitHubRepo = () =>
    window.open(`${HYF_GITHUB_URL}/${this.props.currentModule.module.module_name}`, '_blank');

  render() {
    const { classes, currentModule } = this.props;
    const { students, teachers } = currentModule;

    const { tabIndex } = this.props.timeline;

    return (
      <React.Fragment>
        <Paper className={classes.root}>
          <Tabs value={tabIndex} onChange={this.handleChange}>
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
        {tabIndex === 0 && <ModuleNotes />}
        {tabIndex === 1 && <UserList role="teacher" />}
        {tabIndex === 2 && <UserList role="student" showAttendance={true} />}
      </React.Fragment>
    );
  }
}

StudentInterface.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentModule: PropTypes.object.isRequired,
  timeline: PropTypes.object.isRequired,
};

export default withStyles(styles)(StudentInterface);
