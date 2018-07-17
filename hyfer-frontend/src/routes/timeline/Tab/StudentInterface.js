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
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`,
  },
});

@inject('currentModuleStore', 'currentUser')
@observer
class StudentInterface extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  visitGitHubRepo = () =>
    window.open(`${HYF_GITHUB_URL}/${this.props.currentModuleStore.module.module_name}`, '_blank');

  render() {
    const { classes, currentModuleStore } = this.props;
    const { students, teachers, currentModule, module, group, currentWeek } = currentModuleStore;

    const hasNotes = currentModule && currentModule.notes;
    const { value } = this.state;

    let title = '';
    if (currentModule) {
      title = `${group.group_name} – ${module.module_name}`;
      if (currentWeek && currentModule.duration > 1) {
        title += ` – Week (${currentWeek} of ${currentModule.duration})`;
      }
    }

    return (
      <div className={classes.root}>
        <Paper>
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label={
              <Badge className={classes.padding} color="primary" badgeContent={hasNotes ? 1 : 0}>
                Notes
                </Badge>
            } />
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
            {currentModule && <Tab label={title} disabled />}
          </Tabs>
        </Paper>
        {value === 0 && <TabContainer><ModuleNotes /></TabContainer>}
        {value === 1 && <TabContainer><UserList role="teacher" /></TabContainer>}
        {value === 2 && <TabContainer><UserList role="student" /></TabContainer>}
      </div>
    );
  }
}

StudentInterface.wrappedComponent.propTypes = {
  currentModuleStore: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StudentInterface);
