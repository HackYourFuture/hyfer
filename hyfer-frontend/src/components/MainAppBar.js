import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import cookie from 'react-cookies';

import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
import ConfirmationDialog from './ConfirmationDialog';
import logo from '../assets/images/icon.png';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    top: 0,
    left: 0,
    display: 'flex',
  },
  tabs: {
    flex: 1,
  },
  logo: {
    height: 50,
  },
});

const routes = {
  guest: [
    { label: 'Timeline', path: 'timeline' },
  ],
  student: [
    { label: 'Timeline', path: 'timeline' },
    { label: 'Homework', path: 'homework' },
  ],
  teacher: [
    { label: 'Timeline', path: 'timeline' },
    { label: 'Modules', path: 'modules' },
    { label: 'Users', path: 'users' },
    { label: 'Homework', path: 'homework' },
  ],
};

@inject('currentUser')
@withRouter
@observer
class MainAppBar extends Component {
  state = {
    value: 0,
    isDialogOpen: false,
  };

  role = 'guest';

  handleChange = (event, value) => {
    this.setState({ value });
    const { history } = this.props;
    history.push(routes[this.role][value].path);
  };

  signIn() {
    const url = process.env.NODE_ENV === 'development'
      ? `${process.env.REACT_APP_API_BASE_URL}/auth/github`
      : 'auth/github';
    window.location.href = url;
  }

  handleSignOut = () => {
    this.setState({ isDialogOpen: false });
    localStorage.removeItem('token');
    cookie.save('token', '');
    window.location.reload();
  }

  handleCancelSignOut = () => this.setState({ isDialogOpen: false });

  handleOpenSignOut = () => this.setState({ isDialogOpen: true });

  handleSignInSignOut = () => {
    const { isLoggedIn } = this.props.currentUser;
    if (isLoggedIn) {
      this.setState({ isDialogOpen: true });
    } else {
      this.signIn();
    }
  };

  render() {
    const { classes, currentUser } = this.props;
    const { isLoggedIn, isStudent, isTeacher, avatarUrl } = currentUser;
    const { value } = this.state;

    if (isLoggedIn) {
      if (isTeacher) {
        this.role = 'teacher';
      } else if (isStudent) {
        this.role = 'student';
      }
    }

    return (
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <a href="https://github.com/hackyourfuture" rel="noopener noreferrer" target="_blank">
              <img
                src={logo}
                alt="HackYourFuture logo"
                className={classes.logo}
              />
            </a>
            <Tabs className={classes.tabs} scrollable={true} value={value} onChange={this.handleChange}>
              {routes[this.role].map(route => (
                <Tab key={route.path} label={route.label} />
              ))}
            </Tabs>
            <Button color="inherit" onClick={this.handleSignInSignOut}>
              {isLoggedIn
                ? <Avatar alt={'test'} src={avatarUrl} />
                : 'Sign in'}
            </Button>
          </Toolbar>
        </AppBar>
        <ConfirmationDialog
          title="Confirm sign out"
          message="Do you want to sign out?"
          open={this.state.isDialogOpen}
          onOk={this.handleSignOut}
          onCancel={this.handleCancelSignOut}
        />
      </div>
    );
  }
}

MainAppBar.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainAppBar);
