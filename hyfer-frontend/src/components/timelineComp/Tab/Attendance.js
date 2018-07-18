import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import UserList from './UserList';
// import ModuleNotes from './ModuleNotes';
// import { weekdays } from 'moment';
// import FaGitHub from 'react-icons/lib/fa/github';


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
});

@inject('currentModuleStore', 'global')
@observer
class Attendance extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };


  render() {
    const { classes, currentModuleStore } = this.props;
    const { aantalWeeks } = currentModuleStore;
    const { value } = this.state;


    return (
      <div className={classes.root}>
        <Paper>
          <Tabs value={value} onChange={this.handleChange} >
            {aantalWeeks.map((week, index) => {
              return (
                <Tab key={week} label={`week (${index + 1})`} >
                </Tab>
              );
            })}

          </Tabs>
        </Paper>
        {value === 0 && <TabContainer><UserList selectedWeek={0} role="student" /></TabContainer>}
        {value === 1 && <TabContainer><UserList selectedWeek={1} role="student" /></TabContainer>}
        {value === 2 && <TabContainer><UserList selectedWeek={2} role="student" /></TabContainer>}
        {value === 3 && <TabContainer><UserList selectedWeek={3} role="student" /></TabContainer>}
        {value === 4 && <TabContainer><UserList selectedWeek={4} role="student" /></TabContainer>}
        {value === 5 && <TabContainer><UserList selectedWeek={5} role="student" /></TabContainer>}

      </div>


    );
  }
}

Attendance.wrappedComponent.propTypes = {
  currentModuleStore: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Attendance);
