import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import UserList from './UserList';
import ModuleNotes from './ModuleNotes';
import FaGitHub from 'react-icons/lib/fa/github';

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

const styles = () => ({
  root: {
    flexGrow: 1,
  },
});

@inject('currentModuleStore', 'global')
@observer
class StudentInterface extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes, currentModuleStore, global } = this.props;
    const { students, teachers, module, readme } = currentModuleStore;
    const { value } = this.state;
    console.log(readme);
    return (
      <div className={classes.root}>
        <Paper>
          <Tabs value={value} onChange={this.handleChange} >
            <Tab label="Notes" />
            <Tab label={`Teachers (${teachers.length})`} />
            <Tab label={`Students (${students.length})`} />
            {global.isStudent ?
              <h4 style={{ position: "relative", left: "20%", color: `${module.color}`, fontSize: 18 }}>{`${module.module_name}`}</h4>
              : ""}
            {global.isStudent ?
              <div style={{ position: "relative", left: "40%", marginTop: 15 }}>
                <FaGitHub style={{ width: 40, height: 40 }} />
                <a href={`${HYF_GITHUB_URL}/${module.module_name}`} style={{ fontSize: 20 }} target="_blank" > visit repositorie</a>
              </div>
              : ""}

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
