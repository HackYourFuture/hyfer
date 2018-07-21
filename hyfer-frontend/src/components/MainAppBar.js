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
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import logo from '../assets/images/hyf-icon.svg';
import ProfileEditDialog from './ProfileEditDialog';

const styles = (theme) => {
  const mediaQuery = `@media(max-width: ${theme.breakpoints.values.sm}px)`;
  return {
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
      height: 40,
      [mediaQuery]: {
        height: 24,
      },
    },
    avatar: {
      width: 32,
      height: 32,
    },
  };
};

const routes = {
  guest: [
    { label: 'Timeline', path: 'timeline' },
    { label: 'About', path: 'about' },
  ],
  student: [
    { label: 'Timeline', path: 'timeline' },
    { label: 'Homework', path: 'homework' },
    { label: 'About', path: 'about' },
  ],
  teacher: [
    { label: 'Timeline', path: 'timeline' },
    { label: 'Modules', path: 'modules' },
    { label: 'Users', path: 'users' },
    { label: 'Homework', path: 'homework' },
    { label: 'Train ticket', path: 'TrainTicket' },
    { label: 'About', path: 'about' },
  ],
};

@inject('currentUserStore')
@withRouter
@observer
class MainAppBar extends Component {
  state = {
    value: 0,
    anchorEl: null,
    dialogOpen: false,
  };

  role = 'guest';

  handleChange = (event, value) => {
    this.setState({ value });
    const { history } = this.props;
    history.push(routes[this.role][value].path);
  };

  handleSignOut = () => {
    this.handleMenuClose();
    localStorage.removeItem('token');
    cookie.save('token', '');
    window.location.reload();
  }

  handleClick = (event) => {
    const { isLoggedIn } = this.props.currentUserStore;

    if (isLoggedIn) {
      this.setState({ anchorEl: event.currentTarget });
    } else {
      const url = process.env.NODE_ENV === 'development'
        ? `${process.env.REACT_APP_API_BASE_URL}/auth/github`
        : 'auth/github';
      window.location.href = url;
    }
  };

  handleProfileUpdate = async (profile) => {
    this.handleDialogClose();
    await this.props.currentUserStore.updateCurrentUser(profile);
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  handleDialogOpen = () => {
    this.handleMenuClose();
    this.setState({ dialogOpen: true });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  render() {
    const { classes } = this.props;
    const { isLoggedIn, isStudent, isTeacher, userName, avatarUrl } = this.props.currentUserStore;
    const { value, anchorEl } = this.state;

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
            <Button
              aria-owns={anchorEl ? 'simple-menu' : null}
              aria-haspopup="true"
              color="inherit"
              onClick={this.handleClick}
              title={userName}>
              {isLoggedIn
                ? <Avatar alt={userName} src={avatarUrl} className={classes.avatar} />
                : 'Sign in'}
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleMenuClose}
            >
              <MenuItem onClick={this.handleDialogOpen}>Profile</MenuItem>
              <MenuItem onClick={this.handleSignOut}>Sign out</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <ProfileEditDialog
          profile={this.props.currentUserStore.profile}
          open={this.state.dialogOpen}
          onClose={this.handleDialogClose}
          onUpdate={this.handleProfileUpdate}
        />
      </div>
    );
  }
}

MainAppBar.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentUserStore: PropTypes.object.isRequired,
  history: PropTypes.object,
};

export default withStyles(styles)(MainAppBar);
