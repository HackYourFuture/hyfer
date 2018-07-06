import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import style from '../../../assets/styles/users.css';
import Typography from '@material-ui/core/Typography';
import User from './Users';

import { inject, observer } from 'mobx-react';


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

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

@inject('currentModules')
@observer
class StudentsAttendance extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    const { moduleUsers } = this.props.currentModules;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            scrollable
            scrollButtons="auto"
          >
            {/* <Tab label="Item One" />
            <Tab label="Item Two" />
            <Tab label="Item Three" />
            <Tab label="Item Four" />
            <Tab label="Item Five" />
            <Tab label="Item Six" />
            <Tab label="Item Seven" /> */}
            {this.props.currentModules.weeksAntaal.map((elemet, index) => {
              return <Tab key={index} label={` week ${index + 1}`} />;
            })};
          </Tabs>
        </AppBar>
        {this.props.currentModules.weeksAntaal.map((element, index) => {
          return value === index && <TabContainer>
            <h1> week {index + 1}  </h1>
            <li className={style.userList}>
              <ul className={style.userContainer}>
                {moduleUsers.map(user => {
                  return (
                    <User key={user.id} user={user} />
                  );
                })}
              </ul>
            </li>

          </TabContainer>;

        }

        )}
      </div>
    );
  }
}

StudentsAttendance.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StudentsAttendance);

