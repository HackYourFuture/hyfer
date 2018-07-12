import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Student from './Student';
import Teachers from './Teachers';
import ModuleNotes from './ModuleNotes';

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

class StudentInterface extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    return (
      <div className={classes.root}>
        <Paper>
          <Tabs value={value} onChange={this.handleChange} >
            <Tab label="Teachers" />
            <Tab label="Notes" />
            <Tab label="Students" />
          </Tabs>
        </Paper>
        {value === 0 && <TabContainer><Teachers /></TabContainer>}
        {value === 1 && <TabContainer><ModuleNotes /></TabContainer>}
        {value === 2 && <TabContainer><Student /></TabContainer>}
      </div>
    );
  }
}

StudentInterface.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StudentInterface);
